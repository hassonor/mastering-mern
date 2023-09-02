import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@image/controllers/addImage.controller';
import { Delete } from '@image/controllers/deleteImage.controller';


class ImageRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.post('/images/profile', authMiddleware.checkAuthentication, Add.prototype.profileImage);
        this.router.post('/images/background', authMiddleware.checkAuthentication, Add.prototype.backgroundImage);

        this.router.delete('/images/:imageId', authMiddleware.checkAuthentication, Delete.prototype.profileImage);
        this.router.delete('/images/background/:bgImageId', authMiddleware.checkAuthentication, Delete.prototype.backgroundImage);

        return this.router;
    }
}

export const imageRoutes: ImageRoutes = new ImageRoutes();