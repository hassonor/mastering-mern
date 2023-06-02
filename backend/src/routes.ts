import {Application} from 'express';
import {authRoutes} from '@auth/routes/auth.routes';
import {serverAdapter} from '@service/queues/base.queue';
import {currentUserRoutes} from '@auth/routes/current.routes';
import {authMiddleware} from '@global/helpers/auth-middleware';
import {postRoutes} from '@root/features/post/routes/post.routes';
import {reactionRoutes} from '@reaction/routes/reactionRoutes';

const BASE_PATH = '/api/v1';

export default (app: Application) => {
    const routes = () => {
        app.use('/queues', serverAdapter.getRouter());
        app.use(BASE_PATH, authRoutes.routes());
        app.use(BASE_PATH, authRoutes.signoutRoute());
        app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, postRoutes.routes());
        app.use(BASE_PATH, authMiddleware.verifyUser, reactionRoutes.routes());
    };
    routes();
};
