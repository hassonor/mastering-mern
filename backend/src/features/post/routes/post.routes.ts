import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { CreatePost } from '@root/features/post/controllers/create-post.controller';

class PostRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }


    public routes(): Router {
        this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);
        this.router.post('/post/image/post', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);
        return this.router;
    }
}

export const postRoutes: PostRoutes = new PostRoutes();