import {Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import {FollowerCache} from '@service/redis/follower.cache';
import {UserCache} from '@service/redis/user.cache';
import {IUserDocument} from '@user/interfaces/user.interface';
import {IFollowerData, IFollowers} from '@follower/interfaces/follower.interface';
import mongoose from 'mongoose';
import {socketIOFollowerObject} from '@socket/follower.socket';

const followerCache: FollowerCache = new FollowerCache();
const userCache: UserCache = new UserCache();


export class Add {
    public async follower(req: Request, res: Response): Promise<void> {
        const {followerId} = req.params;

        // update count in cache
        const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followersCount', 1);
        const followingCount: Promise<void> = followerCache.updateFollowersCountInCache(`${req.currentUser!.userId}`, 'followingCount', 1);
        await Promise.all([followersCount, followingCount]);

        const cachedFollower: Promise<IUserDocument> = userCache.getUserFromCache(`${followerId}`) as Promise<IUserDocument>;
        const cachedFollowedUser: Promise<IUserDocument> = userCache.getUserFromCache(`${req.currentUser!.userId}`) as Promise<IUserDocument>;
        const response: [IUserDocument, IUserDocument] = await Promise.all([cachedFollower, cachedFollowedUser]);

        const followerObjectId: ObjectId = new ObjectId();
        const addFollowedUserData: IFollowerData = Add.prototype.userData(response[0]);

        socketIOFollowerObject.emit('add follower', addFollowedUserData);

        const addFollowerToCache: Promise<void> = followerCache.saveFollowerToCache(`followers:${req.currentUser!.userId}`, `${followerId}`);
        const addFollowedUserToCache: Promise<void> = followerCache.saveFollowerToCache(`following:${followerId}`, `${req.currentUser!.userId}`);
        await Promise.all([addFollowerToCache, addFollowedUserToCache]);

        // send data to queue
        res.status(HTTP_STATUS.OK).json({message: 'Following user now'});
    }

    private userData(user: IUserDocument): IFollowerData {
        return {
            _id: new mongoose.Types.ObjectId(user._id),
            username: user.username!,
            avatarColor: user.avatarColor!,
            postCount: user.postsCount,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            profilePicture: user.profilePicture,
            uId: user.uId!,
            userProfile: user
        };
    }
}