import {ObjectId, BulkWriteResult} from 'mongodb';
import mongoose, {Query} from 'mongoose';
import {FollowerModel} from '@follower/models/follower.schema';
import {UserModel} from '@user/models/user.schema';
import {IQueryComplete, IQueryDeleted} from '@post/interfaces/post.interface';
import {IFollowerData, IFollowerDocument} from '@follower/interfaces/follower.interface';
import {INotificationDocument, INotificationTemplate} from '@notification/interfaces/notification.interface';
import {NotificationModel} from '@notification/models/notification.schema';
import {socketIONotificationObject} from '@socket/notification.socket';
import {notificationTemplate} from '@service/emails/templates/notifications/notification-template';
import {emailQueue} from '@service/queues/email.queue';
import {IUserDocument} from '@user/interfaces/user.interface';

class FollowerService {
    public async addFollowerToDB(userId: string, followedUserId: string, username: string, followerDocumentId: ObjectId): Promise<void> {
        const followedUserObjectId: ObjectId = new mongoose.Types.ObjectId(followedUserId);
        const followerObjectId: ObjectId = new mongoose.Types.ObjectId(userId);

        const following = await FollowerModel.create({
            _id: followerDocumentId,
            followedUserId: followedUserObjectId,
            followerId: followerObjectId
        });

        const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
            {
                updateOne: {
                    filter: {_id: userId},
                    update: {$inc: {followingCount: 1}}
                }
            },
            {
                updateOne: {
                    filter: {_id: followedUserId},
                    update: {$inc: {followersCount: 1}}
                }
            }
        ]);

        const response: [BulkWriteResult, IUserDocument | null] = await Promise.all([users, UserModel.findOne({_id: followedUserId})]);

        if (response[1]?.notifications.follows && userId !== followedUserId) {
            const notificationModel: INotificationDocument = new NotificationModel();
            const notifications = await notificationModel.insertNotification({
                userFrom: userId,
                userTo: followedUserId,
                message: `${username} is now following you.`,
                notificationType: 'follows',
                entityId: new mongoose.Types.ObjectId(userId),
                createdItemId: new mongoose.Types.ObjectId(following._id),
                createdAt: new Date(),
                comment: '',
                post: '',
                imgId: '',
                imgVersion: '',
                gifUrl: '',
                reaction: ''
            });
            socketIONotificationObject.emit('insert notification', notifications, {userTo: followedUserId});
            const templateParams: INotificationTemplate = {
                username: response[1].username!,
                message: `${username} is now following you.`,
                header: 'Follower Notification'
            };
            const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
            emailQueue.addEmailJob('followersEmail', {
                receiverEmail: response[1].email!,
                template,
                subject: `${username} is now following you.`
            });
        }
    }

    public async removeFollowerFromDB(followedUserId: string, followerId: string): Promise<void> {
        const followedUserObjectId: ObjectId = new mongoose.Types.ObjectId(followedUserId);
        const followerObjectId: ObjectId = new mongoose.Types.ObjectId(followerId);

        const unfollow: Query<IQueryComplete & IQueryDeleted, IFollowerDocument> = FollowerModel.deleteOne({
            followedUserId: followedUserObjectId,
            followerId: followerObjectId
        });

        const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
            {
                updateOne: {
                    filter: {_id: followerId},
                    update: {$inc: {followingCount: -1}}
                }
            },
            {
                updateOne: {
                    filter: {_id: followedUserId},
                    update: {$inc: {followersCount: -1}}
                }
            }
        ]);

        await Promise.all([unfollow, users]);

    }

    public async getFollowedUser(userObjectId: ObjectId): Promise<IFollowerData[]> {
        const followedUser: IFollowerData[] = await FollowerModel.aggregate([
            {$match: {followerId: userObjectId}},
            {$lookup: {from: 'User', localField: 'followedUserId', foreignField: '_id', as: 'followedUserId'}},
            {$unwind: '$followedUserId'},
            {$lookup: {from: 'Auth', localField: 'followedUserId.authId', foreignField: '_id', as: 'authId'}},
            {$unwind: '$authId'},
            {
                $addFields: {
                    _id: '$followedUserId._id',
                    username: '$authId.username',
                    avatarColor: '$authId.avatarColor',
                    uId: '$authId.uId',
                    postsCount: '$followedUserId.postsCount',
                    followersCount: '$followedUserId.followersCount',
                    followingCount: '$followedUserId.followingCount',
                    profilePicture: '$followedUserId.profilePicture',
                    userProfile: '$followedUserId'
                }
            },
            {
                $project: {
                    authId: 0,
                    followerId: 0,
                    followedUserId: 0,
                    createAt: 0,
                    __v: 0
                }
            }
        ]);

        return followedUser;
    }

    public async getFollowerUser(userObjectId: ObjectId): Promise<IFollowerData[]> {
        const followerUser: IFollowerData[] = await FollowerModel.aggregate([
            {$match: {followedUserId: userObjectId}},
            {$lookup: {from: 'User', localField: 'followerId', foreignField: '_id', as: 'followerId'}},
            {$unwind: '$followerId'},
            {$lookup: {from: 'Auth', localField: 'followerId.authId', foreignField: '_id', as: 'authId'}},
            {$unwind: '$authId'},
            {
                $addFields: {
                    _id: '$followerId._id',
                    username: '$authId.username',
                    avatarColor: '$authId.avatarColor',
                    uId: '$authId.uId',
                    postsCount: '$followerId.postsCount',
                    followersCount: '$followerId.followersCount',
                    followingCount: '$followerId.followingCount',
                    profilePicture: '$followerId.profilePicture',
                    userProfile: '$followerId'
                }
            },
            {
                $project: {
                    authId: 0,
                    followerId: 0,
                    followedUserId: 0,
                    createAt: 0,
                    __v: 0
                }
            }
        ]);

        return followerUser;
    }
}

export const followerService: FollowerService = new FollowerService();