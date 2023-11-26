import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Get } from '@user/controllers/getProfile.controller';

class UserRoutes {
    private router: Router;


    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/user/all/:page', authMiddleware.checkAuthentication, Get.prototype.all);
        return this.router;
    }
}

export const userRoutes: UserRoutes = new UserRoutes();