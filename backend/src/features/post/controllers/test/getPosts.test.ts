import {Request, Response} from 'express';
import {authUserPayload} from '@root/mocks/auth.mock';
import {newPost, postMockData, postMockRequest, postMockResponse} from '@root/mocks/post.mock';
import {PostCache} from '@service/redis/post.cache';
import {GetPosts} from '@post/controllers/getPosts.controller';
import {postService} from '@service/db/post.service';

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/post.cache');

describe('GetPosts', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('posts', () => {
        it('should send correct json response if posts exist in cache', async () => {
            const req: Request = postMockRequest(newPost, authUserPayload, {page: '1'}) as Request;
            const res: Response = postMockResponse();
            jest.spyOn(PostCache.prototype, 'getPostsFromCache').mockResolvedValue([postMockData]);
            jest.spyOn(PostCache.prototype, 'getTotalPostsInCache').mockResolvedValue(1);

            await GetPosts.prototype.posts(req, res);
            expect(PostCache.prototype.getPostsFromCache).toHaveBeenCalledWith('post', 0, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All posts',
                posts: [postMockData],
                totalPosts: 1
            });
        });

        it('should send correct json response if posts exist in database', async () => {
            const req: Request = postMockRequest(newPost, authUserPayload, {page: '1'}) as Request;
            const res: Response = postMockResponse();
            jest.spyOn(PostCache.prototype, 'getPostsFromCache').mockResolvedValue([]);
            jest.spyOn(PostCache.prototype, 'getTotalPostsInCache').mockResolvedValue(0);
            jest.spyOn(postService, 'getPosts').mockResolvedValue([postMockData]);
            jest.spyOn(postService, 'postsCount').mockResolvedValue(1);

            await GetPosts.prototype.posts(req, res);
            expect(postService.getPosts).toHaveBeenCalledWith({}, 0, 10, {createdAt: -1});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All posts',
                posts: [postMockData],
                totalPosts: 1
            });
        });

        it('should send empty posts', async () => {
            const req: Request = postMockRequest(newPost, authUserPayload, {page: '1'}) as Request;
            const res: Response = postMockResponse();
            jest.spyOn(PostCache.prototype, 'getPostsFromCache').mockResolvedValue([]);
            jest.spyOn(PostCache.prototype, 'getTotalPostsInCache').mockResolvedValue(0);
            jest.spyOn(postService, 'getPosts').mockResolvedValue([]);
            jest.spyOn(postService, 'postsCount').mockResolvedValue(0);

            await GetPosts.prototype.posts(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All posts',
                posts: [],
                totalPosts: 0
            });
        });
    });

    describe('postWithImages', () => {
        it('should send correct json response if posts exist in cache', async () => {
            const req: Request = postMockRequest(newPost, authUserPayload, {page: '1'}) as Request;
            const res: Response = postMockResponse();
            jest.spyOn(PostCache.prototype, 'getPostsWithImagesFromCache').mockResolvedValue([postMockData]);

            await GetPosts.prototype.postsWithImages(req, res);
            expect(PostCache.prototype.getPostsWithImagesFromCache).toHaveBeenCalledWith('post', 0, 10);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All posts with images',
                posts: [postMockData]
            });
        });

        it('should send correct json response if posts exist in database', async () => {
            const req: Request = postMockRequest(newPost, authUserPayload, {page: '1'}) as Request;
            const res: Response = postMockResponse();
            jest.spyOn(PostCache.prototype, 'getPostsWithImagesFromCache').mockResolvedValue([]);
            jest.spyOn(postService, 'getPosts').mockResolvedValue([postMockData]);

            await GetPosts.prototype.postsWithImages(req, res);
            expect(postService.getPosts).toHaveBeenCalledWith({imgId: '$ne', gifUrl: '$ne'}, 0, 10, {createdAt: -1});
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All posts with images',
                posts: [postMockData]
            });
        });

        it('should send empty posts', async () => {
            const req: Request = postMockRequest(newPost, authUserPayload, {page: '1'}) as Request;
            const res: Response = postMockResponse();
            jest.spyOn(PostCache.prototype, 'getPostsWithImagesFromCache').mockResolvedValue([]);
            jest.spyOn(postService, 'getPosts').mockResolvedValue([]);

            await GetPosts.prototype.postsWithImages(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'All posts with images',
                posts: []
            });
        });
    });
});
