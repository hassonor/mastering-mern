import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { ISavePostToCache } from '@root/features/post/interfaces/post.interface';

const log: Logger = config.createLogger('postCache');

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
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const postCount: string[] = await this.client.HMGET(`users:${currentUserId}`, 'postsCount');
            const multi: ReturnType<typeof this.client.multi> = this.client.multi(); //multi allow us to do multi redis methods on the client
            multi.ZADD('post', {score: parseInt(uId, 10), value: `${key}`}); //add post property
            multi.HSET(`posts:${key}`, dataToSave); // Save the new post
            const count: number = parseInt(postCount[0], 10) + 1; // Increment post count by 1
            multi.HSET(`users:${currentUserId}`, ['postsCount', count]); // Update the currentUser postCount field
            multi.exec();
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }

    }

}