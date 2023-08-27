import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Update } from '@notification/controllers/updateNotification.controller';
import { Delete } from '@notification/controllers/deleteNotifcation.controller';
import { Get } from '@notification/controllers/getNotification.controller';

class NotificationRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/notifications', authMiddleware.checkAuthentication, Get.prototype.notifications);
        this.router.put('/notification/:notificationId', authMiddleware.checkAuthentication, Update.prototype.notification);
        this.router.delete('/notification/:notificationId', authMiddleware.checkAuthentication, Delete.prototype.notification);

        return this.router;
    }
}

export const notificationRoutes: NotificationRoutes = new NotificationRoutes();