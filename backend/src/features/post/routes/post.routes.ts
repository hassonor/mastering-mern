import express, {Router} from 'express';
import {authMiddleware} from '@global/helpers/auth-middleware';
import {CreatePost} from '@post/controllers/createPost.controller';
import {GetPosts} from '@post/controllers/getPosts.controller';
import {DeletePost} from '@post/controllers/deletePost.controller';

class PostRoutes {
    private router: Router;

    constructor() {
        this.router = express.Router();
    }


    public routes(): Router {
        this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);
        this.router.post('/post/image/post', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);

        this.router.get('/post/all/:page', authMiddleware.checkAuthentication, GetPosts.prototype.posts);
        this.router.get('/post/images/:page', authMiddleware.checkAuthentication, GetPosts.prototype.postsWithImages);

        this.router.delete('/post/:postId', authMiddleware.checkAuthentication, DeletePost.prototype.post);
        
        return this.router;
    }
}

export const postRoutes: PostRoutes = new PostRoutes();