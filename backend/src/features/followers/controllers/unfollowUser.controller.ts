import {Request, Response} from 'express';
import HTTP_STATUS from 'http-status-codes';
import {FollowerCache} from '@service/redis/follower.cache';
import {IUserDocument} from '@user/interfaces/user.interface';
import {IFollowerData} from '@follower/interfaces/follower.interface';
import mongoose from 'mongoose';
import {followerQueue} from '@service/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();

export class Remove {
    public async follower(req: Request, res: Response): Promise<void> {
        const {followedUserId, followerId} = req.params;

        const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`following:${req.currentUser!.userId}`, `${followedUserId}`);
        const removeFollowedUserFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${followedUserId}`, followerId);
        ;

        const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followedUserId}`, 'followersCount', -1);
        const followingCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);

        await Promise.all([removeFollowerFromCache, removeFollowedUserFromCache, followersCount, followingCount]);

        followerQueue.addFollowerJob('removeFollowerFromDB', {
            keyOne: `${followedUserId}`,
            keyTwo: `${followerId}`,
        });

        res.status(HTTP_STATUS.OK).json({message: 'Unfollowed user now'});
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