import { Request, Response } from 'express';
import { UserCache } from '@service/redis/user.cache';
import { FollowerCache } from '@service/redis/follower.cache';
import HTTP_STATUS from 'http-status-codes';
import { IAllUsers, IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { IFollowerData } from '@follower/interfaces/follower.interface';
import { followerService } from '@service/db/follower.service';
import mongoose from 'mongoose';
import { Helpers } from '@global/helpers/helpers';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostCache } from '@service/redis/post.cache';
import { parseInt } from 'lodash';
import { postService } from '@service/db/post.service';

const PAGE_SIZE = 12;

interface IUserAll {
    newSkip: number;
    limit: number;
    skip: number;
    userId: string;
}

const userCache: UserCache = new UserCache();
const postCache: PostCache = new PostCache();
const followerCache: FollowerCache = new FollowerCache();

export class Get {
    public async all(req: Request, res: Response): Promise<void> {
        const {page} = req.params;
        const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
        const limit: number = PAGE_SIZE * parseInt(page);
        const newSkip: number = skip === 0 ? skip : skip + 1; // Skip for Redis Cache

        const allUsers = await Get.prototype.allUsers({newSkip, limit, skip, userId: `${req.currentUser!.userId}`});
        const followers: IFollowerData[] = await Get.prototype.followers(`${req.currentUser!.userId}`);

        res.status(HTTP_STATUS.OK).json({
            message: 'Get users',
            users: allUsers.users,
            totalUsers: allUsers.totalUsers,
            followers
        });
    }

    public async profile(req: Request, res: Response): Promise<void> {
        const cachedUser: IUserDocument = await userCache.getUserFromCache(`${req.currentUser!.userId}`) as IUserDocument;
        const existingUser: IUserDocument = cachedUser ? cachedUser
            : await userService.getUserById(`${req.currentUser!.userId}`);

        res.status(HTTP_STATUS.OK).json({
            message: 'Get user profile', user: existingUser
        });
    }

    public async profileByUserId(req: Request, res: Response): Promise<void> {
        const {userId} = req.params;

        const cachedUser: IUserDocument = await userCache.getUserFromCache(userId) as IUserDocument;
        const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(userId);

        res.status(HTTP_STATUS.OK).json({
            message: 'Get user profile by id', user: existingUser
        });
    }

    public async profileAndPosts(req: Request, res: Response): Promise<void> {
        const {userId, username, uId} = req.params;

        const userName: string = Helpers.firstLetterUppercase(username);

        const cachedUser: IUserDocument = await userCache.getUserFromCache(userId) as IUserDocument;
        const cachedUserPosts: IPostDocument[] = await postCache.getUsersPostsFromCache('post', parseInt(uId, 10)) as IPostDocument[];

        const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(userId);
        const userPosts: IPostDocument[] = cachedUserPosts.length ? cachedUserPosts
            : await postService.getPosts({username: userName}, 0, 100, {createdAt: -1});

        res.status(HTTP_STATUS.OK).json({
            message: 'Get user profile and posts', user: existingUser, posts: userPosts
        });
    }

    private async allUsers({newSkip, limit, skip, userId}: IUserAll): Promise<IAllUsers> {
        let users;
        let sourceOfData = '';

        const cachedUsers: IUserDocument[] = await userCache.getUsersFromCache(newSkip, limit, userId) as IUserDocument[];
        if (cachedUsers.length) {
            sourceOfData = 'redis';
            users = cachedUsers;
        } else {
            sourceOfData = 'mongodb';
            users = await userService.getAllUsers(userId, skip, limit);
        }

        const totalUsers: number = await Get.prototype.usersCount(sourceOfData);

        return {users, totalUsers};
    }

    private async usersCount(sourceOfData: string): Promise<number> {
        const totalUsers: number = sourceOfData === 'redis' ? await userCache.getTotalUsersInCache()
            : await userService.getTotalUsersInDB();
        return totalUsers;
    }

    private async followers(userId: string): Promise<IFollowerData[]> {
        const cachedFollowers: IFollowerData[] = await followerCache.getFollowersFromCache(`followers:${userId}`);
        const result = cachedFollowers.length ? cachedFollowers
            : await followerService.getFollowerUser(new mongoose.Types.ObjectId(userId));

        return result;
    }
}
