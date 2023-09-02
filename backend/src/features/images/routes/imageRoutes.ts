import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@image/controllers/addImage.controller';


class ImageRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/images/profile', authMiddleware.checkAuthentication, Add.prototype.profileImage);
        this.router.post('/images/background', authMiddleware.checkAuthentication, Add.prototype.backgroundImage);

        return this.router;
    }
}

export const imageRoutes: ImageRoutes = new ImageRoutes();