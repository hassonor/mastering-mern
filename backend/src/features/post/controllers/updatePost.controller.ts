import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostCache } from '@service/redis/post.cache';
import { postService } from '@service/db/post.service';
import { socketIOPostObject } from '@socket/post.socket';
import { postQueue } from '@service/queues/post.queue';
import { postSchema, postWithImageSchema, postWithVideoSchema } from '@post/schemes/post.schemes';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';
import { UploadApiResponse } from 'cloudinary';
import { uploads, videoUpload } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { imageQueue } from '@service/queues/image.queue';

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
            profilePicture,
            videoId,
            videoVersion
        } = req.body;
        const {postId} = req.params;
        const updatedPost: IPostDocument = {
            post,
            bgColor,
            privacy,
            feelings,
            gifUrl,
            profilePicture,
            imgId,
            imgVersion,
            videoId,
            videoVersion
        } as IPostDocument;

        const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
        socketIOPostObject.emit('update post', postUpdated, 'posts');
        postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
        res.status(HTTP_STATUS.OK).json({message: 'Post updated successfully'});
    }

    @JoiValidation(postWithImageSchema)
    public async postWithImage(req: Request, res: Response): Promise<void> {
        const {imgId, imgVersion} = req.body;
        if (imgId && imgVersion) {
            await UpdatePost.prototype.updatePost(req);
        } else {
            const result: UploadApiResponse = await UpdatePost.prototype.addFileToExistingPost(req);
            if (!result.public_id) {
                throw new BadRequestError(result.message);
            }
        }
        res.status(HTTP_STATUS.OK).json({message: 'Post with image updated successfully'});
    }

    @JoiValidation(postWithVideoSchema)
    public async postWithVideo(req: Request, res: Response): Promise<void> {
        const {videoId, videoVersion} = req.body;
        if (videoId && videoVersion) {
            await UpdatePost.prototype.updatePost(req);
        } else {
            const result: UploadApiResponse = await UpdatePost.prototype.addFileToExistingPost(req);
            if (!result.public_id) {
                throw new BadRequestError(result.message);
            }
        }
        res.status(HTTP_STATUS.OK).json({message: 'Post with image updated successfully'});
    }

    private async updatePost(req: Request): Promise<void> {
        const {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            imgVersion,
            imgId,
            profilePicture,
            videoId,
            videoVersion
        } = req.body;
        const {postId} = req.params;
        const updatedPost: IPostDocument = {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            profilePicture,
            imgId: imgId ? imgId : '',
            imgVersion: imgVersion ? imgVersion : '',
            videoId: videoId ? videoId : '',
            videoVersion: videoVersion ? videoVersion : ''
        } as IPostDocument;
        const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
        socketIOPostObject.emit('update post', postUpdated, 'posts');
        postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});
    };

    private async addFileToExistingPost(req: Request): Promise<UploadApiResponse> {
        const {
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            profilePicture,
            image,
            video
        } = req.body;
        const {postId} = req.params;
        const result: UploadApiResponse = image ? (await uploads(image)) as UploadApiResponse : (await videoUpload(video)) as UploadApiResponse;
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
            imgId: image ? result.public_id : '',
            imgVersion: image ? result.version.toString() : '',
            videoId: video ? result.public_id : '',
            videoVersion: video ? result.version.toString() : ''
        } as IPostDocument;
        const postUpdated: IPostDocument = await postCache.updatePostInCache(postId, updatedPost);
        socketIOPostObject.emit('update post', postUpdated, 'posts');
        postQueue.addPostJob('updatePostInDB', {key: postId, value: postUpdated});

        if (image) {
            imageQueue.addImageJob('addImageToDB', {
                key: `${req.currentUser!.userId}`,
                imgId: result.public_id,
                imgVersion: result.version.toString()
            });
        } else {
            //TODO: add video queue and expand video feature like images
        }


        return result;
    };

}