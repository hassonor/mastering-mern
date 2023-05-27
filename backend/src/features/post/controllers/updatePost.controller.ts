import {Request, Response} from 'express';
import HTTP_STATUS from 'http-status-codes';
import {IPostDocument} from '@post/interfaces/post.interface';
import {PostCache} from '@service/redis/post.cache';
import {postService} from '@service/db/post.service';
import {socketIOPostObject} from '@socket/post';
import {postQueue} from '@service/queues/post.queue';
import {postSchema, postWithImageSchema} from '@post/schemes/post.schemes';
import {JoiValidation} from '@global/decorators/joi-validation.decorators';
import {UploadApiResponse} from 'cloudinary';
import {uploads} from '@global/helpers/cloudinary-upload';
import {BadRequestError} from '@global/helpers/error-handler';

const postCache: PostCache = new PostCache();


export class UpdatePost {
    @JoiValidation(postSchema)
    public async post(req: Request, res: Response): Promise<void> {
        await UpdatePost.prototype.updatePostWithImage(req);
        res.status(HTTP_STATUS.OK).json({message: 'Post updated successfully'});
    }

    @JoiValidation(postWithImageSchema)
    public async postWithImage(req: Request, res: Response): Promise<void> {
        const {imgId, imgVersion} = req.body;
        if (imgId && imgVersion) {
            await UpdatePost.prototype.updatePostWithImage(req);
        } else {
            const result: UploadApiResponse = await UpdatePost.prototype.addImageToExistingPost(req);
            if (!result.public_id) {
                throw new BadRequestError(result.message);
            }
        }
        res.status(HTTP_STATUS.OK).json({message: 'Post with image updated successfully'});
    }

    private async updatePostWithImage(req: Request): Promise<void> {
        const {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            imgVersion,
            imgId,
            profilePicture
        } = req.body;
        const {postId} = req.params;
        const updatedPost: IPostDocument = {
            post, bgColor, feelings, privacy, gifUrl, imgVersion, imgId, profilePicture
        } as IPostDocument;
        const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
        socketIOPostObject.emit('update post', postUpdated, 'posts');
        postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
    };

    private async addImageToExistingPost(req: Request): Promise<UploadApiResponse> {
        const {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            profilePicture,
            image
        } = req.body;
        const {postId} = req.params;
        const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
        if (!result?.public_id) {
            return result;
        }
        const updatedPost: IPostDocument = {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            profilePicture,
            imgId: result.public_id,
            imgVersion: result.version.toString()
        } as IPostDocument;
        const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
        socketIOPostObject.emit('update post', postUpdated, 'posts');
        postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
        // call image queue to add image to mongodb database

        return result;
    };

}