import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Get } from '@user/controllers/getProfile.controller';
import { Search } from '@user/controllers/searchUser.controller';
import { Update } from '@user/controllers/changePassword.controller';
import { Update as UpdateBasicInfo } from '@user/controllers/updateBasicInfo.controller';
import { UpdateSettings } from '@user/controllers/updateSettings.controller';

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
        this.router.put('/user/profile/basic-info', authMiddleware.checkAuthentication, UpdateBasicInfo.prototype.info);
        this.router.put('/user/profile/social-links', authMiddleware.checkAuthentication, UpdateBasicInfo.prototype.social);
        this.router.put('/user/profile/notification-settings', authMiddleware.checkAuthentication, UpdateSettings.prototype.notifications);

        return this.router;
    }
}

export const userRoutes: UserRoutes = new UserRoutes();