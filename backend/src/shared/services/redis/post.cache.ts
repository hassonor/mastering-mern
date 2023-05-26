import {BaseCache} from '@service/redis/base.cache';
import Logger from 'bunyan';
import {config} from '@root/config';
import {ServerError} from '@global/helpers/error-handler';
import {IPostDocument, IReactions, ISavePostToCache} from '@root/features/post/interfaces/post.interface';
import {Helpers} from '@global/helpers/helpers';
import {RedisCommandRawReply} from '@redis/client/dist/lib/commands';

const log: Logger = config.createLogger('postCache');

export type PostCacheMultiType = string | number | Buffer | RedisCommandRawReply[] | IPostDocument | IPostDocument[];

export class PostCache extends BaseCache {
    constructor() {
        super('postCache');
    }

    public async savePostToCache(data: ISavePostToCache): Promise<void> {
        const {key, currentUserId, uId, createdPost} = data;
        const {
            _id,
            userId,
            username,
            email,
            avatarColor,
            profilePicture,
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            commentsCount,
            imgVersion,
            imgId,
            videoId,
            videoVersion,
            reactions,
            createdAt
        } = createdPost;

        const firstList: string[] = [
            '_id',
            `${_id}`,
            'userId',
            `${userId}`,
            'username',
            `${username}`,
            'email',
            `${email}`,
            'avatarColor',
            `${avatarColor}`,
            'profilePicture',
            `${profilePicture}`,
            'post',
            `${post}`,
            'bgColor',
            `${bgColor}`,
            'feelings',
            `${feelings}`,
            'privacy',
            `${privacy}`,
            'gifUrl',
            `${gifUrl}`
        ];

        const secondList: string[] = [
            'commentsCount',
            `${commentsCount}`,
            'reactions',
            JSON.stringify(reactions),
            'imgVersion',
            `${imgVersion}`,
            'imgId',
            `${imgId}`,
            'videoId',
            `${videoId}`,
            'videoVersion',
            `${videoVersion}`,
            'createdAt',
            `${createdAt}`
        ];

        const dataToSave: string[] = [...firstList, ...secondList];

        try {
            // Ensure the client is connected before interacting with the database
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            // Fetch the current user's post count
            const postCount: string[] = await this.client.HMGET(`users:${currentUserId}`, 'postsCount');

            // Multi provides a way to perform multiple operations atomically on the client
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();

            // Create a new post
            multi.ZADD('post', {score: parseInt(uId, 10), value: `${key}`});
            multi.HSET(`posts:${key}`, dataToSave);

            // Increment the user's post count
            const count: number = parseInt(postCount[0], 10) + 1;
            multi.HSET(`users:${currentUserId}`, ['postsCount', count]);

            // Execute the multi operations
            multi.exec();
        } catch (error) {
            // Log the error and re-throw with a more descriptive message
            log.error(error);
            throw new ServerError('Failed to create post. Please try again.');
        }
    }

    public async getPostsFromCache(key: string, start: number, end: number): Promise<IPostDocument[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const reply: string[] = await this.client.ZRANGE(key, start, end, {REV: true});
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();
            for (const value of reply) {
                multi.HGETALL(`posts:${value}`);
            }

            const replies: PostCacheMultiType = await multi.exec();
            const postReplies: IPostDocument [] = [];
            for (const post of replies as unknown as IPostDocument[]) {
                post.commentsCount = Helpers.parseJson(`${post.commentsCount}`) as number;
                post.reactions = Helpers.parseJson(`${post.reactions}`) as IReactions;
                post.createdAt = new Date(Helpers.parseJson(`${post.createdAt}`));
                postReplies.push(post);
            }

            return postReplies;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async getTotalPostsInCache(): Promise<number> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const count: number = await this.client.ZCARD('post');
            return count;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async getPostsWithImagesFromCache(key: string, start: number, end: number): Promise<IPostDocument[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const reply: string[] = await this.client.ZRANGE(key, start, end, {REV: true});
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();
            for (const value of reply) {
                multi.HGETALL(`posts:${value}`);
            }

            const replies: PostCacheMultiType = await multi.exec();
            const postWithImages: IPostDocument [] = [];
            for (const post of replies as unknown as IPostDocument[]) {
                if (post?.imgId && post?.imgVersion || post?.gifUrl) {
                    post.commentsCount = Helpers.parseJson(`${post.commentsCount}`) as number;
                    post.reactions = Helpers.parseJson(`${post.reactions}`) as IReactions;
                    post.createdAt = new Date(Helpers.parseJson(`${post.createdAt}`));
                    postWithImages.push(post);
                }
            }

            return postWithImages;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async getUsersPostsFromCache(key: string, uId: number): Promise<IPostDocument[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const reply: string[] = await this.client.ZRANGE(key, uId, uId, {REV: true, BY: 'SCORE'});
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();
            for (const value of reply) {
                multi.HGETALL(`posts:${value}`);

            }

            const replies: PostCacheMultiType = await multi.exec();
            const postReplies: IPostDocument [] = [];
            for (const post of replies as unknown as IPostDocument[]) {
                post.commentsCount = Helpers.parseJson(`${post.commentsCount}`) as number;
                post.reactions = Helpers.parseJson(`${post.reactions}`) as IReactions;
                post.createdAt = new Date(Helpers.parseJson(`${post.createdAt}`));
                postReplies.push(post);

            }

            return postReplies;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async getTotalUserPostsInCache(uId: number): Promise<number> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const count: number = await this.client.ZCOUNT('post', uId, uId);
            return count;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async deletePostFromCache(key: string, currentUserId: string): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const postCount: string[] = await this.client.HMGET(`users:${currentUserId}`, 'postsCount');
            const multi: ReturnType<typeof this.client.multi> = this.client.multi();
            multi.ZREM('post', `${key}`);
            multi.DEL(`posts:${key}`);
            multi.DEL(`comments:${key}`);
            multi.DEL(`reactions:${key}`);
            const count: number = parseInt(postCount[0], 10) - 1;
            multi.HSET(`users:${currentUserId}`, 'postsCount', count);
            const results = await multi.exec();
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

}