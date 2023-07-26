import {Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import {FollowerCache} from '@service/redis/follower.cache';
import {blockedUserQueue} from '@service/queues/blocked.queue';

const followerCache: FollowerCache = new FollowerCache();


export class AddUser {
    public async block(req: Request, res: Response): Promise<void> {
        const {followerId} = req.params;
        AddUser.prototype.updateBlockedUser(followerId, req.currentUser!.userId, 'block');
        blockedUserQueue.addBlockedUserJob('addBlockedUserToDB', {
            keyOne: `${req.currentUser!.userId}`,
            keyTwo: `${followerId}`,
            action: 'block'
        });
        res.status(HTTP_STATUS.OK).json({message: 'User blocked'});

    };

    public async unblock(req: Request, res: Response): Promise<void> {
        const {followerId} = req.params;
        AddUser.prototype.updateBlockedUser(followerId, req.currentUser!.userId, 'unblock');
        blockedUserQueue.addBlockedUserJob('removeBlockedUserFromDB', {
            keyOne: `${req.currentUser!.userId}`,
            keyTwo: `${followerId}`,
            action: 'unblock'
        });
        res.status(HTTP_STATUS.OK).json({message: 'User unblocked'});

    };

    private async updateBlockedUser(followerId: string, userId: string, action: 'block' | 'unblock'): Promise<void> {
        const blockedBy: Promise<void> = followerCache.updateBlockedUserPropInCache(`${followerId}`, 'blockedBy', `${userId}`, action);
        const blocked: Promise<void> = followerCache.updateBlockedUserPropInCache(`${userId}`, 'blocked', `${followerId}`, action);

        await Promise.all([blocked, blockedBy]);
    }
}