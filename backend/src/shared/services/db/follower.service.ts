import {ObjectId, BulkWriteResult} from 'mongodb';
import mongoose from 'mongoose';
import {FollowerModel} from '@follower/models/follower.schema';
import {UserModel} from '@user/models/user.schema';

class FollowerService {
    public async addFollowerToDB(userId: string, followedUserId: string, username: string, followerDocumentId: ObjectId): Promise<void> {
        const followedUserObjectId: ObjectId = new mongoose.Types.ObjectId(followedUserId);
        const followerObjectId: ObjectId = new mongoose.Types.ObjectId(userId);

        await FollowerModel.create({
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

        await Promise.all([users, UserModel.findOne({_id: followedUserId})]);
    }
}

export const followerService: FollowerService = new FollowerService();