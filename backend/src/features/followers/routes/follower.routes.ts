import express, {Router} from 'express';
import {authMiddleware} from '@global/helpers/auth-middleware';
import {Add} from '@follower/controllers/followerUser.controller';
import {Remove} from '@follower/controllers/unfollowUser.controller';
import {Get} from '@follower/controllers/getFollowers.controller';
import {AddUser} from '@follower/controllers/blockedUser.controller';


class FollowerRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/user/following', authMiddleware.checkAuthentication, Get.prototype.userFollowing);
        this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, Get.prototype.userFollowers);
        this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);
        this.router.put('/user/unfollow/:followedUserId/:followerId', authMiddleware.checkAuthentication, Remove.prototype.follower);

        this.router.put('/user/block/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.block);
        this.router.put('/user/unblock/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.unblock);
        return this.router;
    }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();