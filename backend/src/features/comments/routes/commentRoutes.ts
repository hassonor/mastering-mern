import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Get } from '@comment/controllers/getComments.controller';
import { Add } from '@comment/controllers/addComment.controller';

class CommentRoutes {
    private readonly router: Router;

    constructor() {
        this.router = express.Router();
    }

    public routes(): Router {
        this.router.get('/post/comments/:postId', authMiddleware.checkAuthentication, Get.prototype.comments);
        this.router.get('/post/comments/names/:postId', authMiddleware.checkAuthentication, Get.prototype.commentsNames);
        this.router.get('/post/single/comment/:postId/:commentId', authMiddleware.checkAuthentication, Get.prototype.singleComment);

        this.router.post('/post/comment', authMiddleware.checkAuthentication, Add.prototype.comment);

        return this.router;
    }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();