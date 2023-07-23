import express, {Router} from 'express';
import {authMiddleware} from '@global/helpers/auth-middleware';
import {Add} from '@follower/controllers/followerUser.controller';


class FollowerRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, Add.prototype.follower);
        
        return this.router;
    }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();