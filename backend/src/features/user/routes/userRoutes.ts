import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Get } from '@user/controllers/getProfile.controller';
import { Search } from '@user/controllers/searchUser.controller';
import { Update } from '@user/controllers/changePassword';

class UserRoutes {
    private router: Router;


    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/user/all/:page', authMiddleware.checkAuthentication, Get.prototype.all);
        this.router.get('/user/profile', authMiddleware.checkAuthentication, Get.prototype.profile);
        this.router.get('/user/profile/suggestions', authMiddleware.checkAuthentication, Get.prototype.randomUserSuggestions);
        this.router.get('/user/profile/search/:query', authMiddleware.checkAuthentication, Search.prototype.users);
        this.router.get('/user/profile/posts/:username/:userId/:uId', authMiddleware.checkAuthentication, Get.prototype.profileAndPosts);
        this.router.get('/user/profile/:userId', authMiddleware.checkAuthentication, Get.prototype.profileByUserId);


        this.router.put('/user/profile/change-password', authMiddleware.checkAuthentication, Update.prototype.password);
        return this.router;
    }
}

export const userRoutes: UserRoutes = new UserRoutes();