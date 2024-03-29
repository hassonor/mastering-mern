import { Application } from 'express';
import { authRoutes } from '@auth/routes/auth.routes';
import { serverAdapter } from '@service/queues/base.queue';
import { currentUserRoutes } from '@auth/routes/current.routes';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { postRoutes } from '@root/features/post/routes/post.routes';
import { reactionRoutes } from '@reaction/routes/reaction.routes';
import { commentRoutes } from '@comment/routes/comment.routes';
import { followerRoutes } from '@follower/routes/follower.routes';
import { notificationRoutes } from '@notification/routes/notification.routes';
import { imageRoutes } from '@image/routes/image.routes';
import { chatRoutes } from '@chat/routes/chat.routes';
import { userRoutes } from '@user/routes/user.routes';
import { healthRoutes } from '@user/routes/health.routes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
    const routes = () => {
        app.use('/queues', serverAdapter.getRouter());
        app.use('', healthRoutes.health());
        app.use('', healthRoutes.env());
        app.use('', healthRoutes.instance());
        app.use('', healthRoutes.fiboRoutes());

        app.use(BASE_PATH, authRoutes.routes());
        app.use(BASE_PATH, authRoutes.signoutRoute());
        app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, userRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, commentRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, followerRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, notificationRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, imageRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, chatRoutes.routes());
    };
    routes();
};
