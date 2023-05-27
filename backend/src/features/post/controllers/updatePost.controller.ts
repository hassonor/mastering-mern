import {Request, Response} from 'express';
import HTTP_STATUS from 'http-status-codes';
import {IPostDocument} from '@post/interfaces/post.interface';
import {PostCache} from '@service/redis/post.cache';
import {postService} from '@service/db/post.service';
import {socketIOPostObject} from '@socket/post';
import {postQueue} from '@service/queues/post.queue';
import {postSchema} from '@post/schemes/post.schemes';
import {JoiValidation} from '@global/decorators/joi-validation.decorators';

const postCache: PostCache = new PostCache();


export class UpdatePost {
    @JoiValidation(postSchema)
    public async post(req: Request, res: Response): Promise<void> {
        const {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            imgVersion,
            imgId,
            videoId,
            videoVersion,
            profilePicture
        } = req.body;
        const {postId} = req.params;
        const updatedPost: IPostDocument = {
            post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, videoId, videoVersion, profilePicture
        } as IPostDocument;
        const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
        socketIOPostObject.emit('update post', postUpdated, 'posts');
        postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
        res.status(HTTP_STATUS.OK).json({message: 'Post updated successfully'});
    }

}