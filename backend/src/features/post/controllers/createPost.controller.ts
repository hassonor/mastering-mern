import {Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import {JoiValidation} from '@global/decorators/joi-validation.decorators';
import {postSchema, postWithImageSchema} from '@root/features/post/schemes/post.schemes';
import {IPostDocument} from '@root/features/post/interfaces/post.interface';
import {PostCache} from '@service/redis/post.cache';
import {socketIOPostObject} from '@socket/post.socket';
import {postQueue} from '@service/queues/post.queue';
import {UploadApiResponse} from 'cloudinary';
import {uploads} from '@global/helpers/cloudinary-upload';
import {BadRequestError} from '@global/helpers/error-handler';

const postCache: PostCache = new PostCache();

export class CreatePost {
    @JoiValidation(postSchema)
    public async post(req: Request, res: Response): Promise<void> {
        const {post, bgColor, privacy, gifUrl, profilePicture, feelings} = req.body;

        const postObjectId: ObjectId = new ObjectId();
        const createdPost: IPostDocument = {
            _id: postObjectId,
            userId: req.currentUser!.userId, // Only Login user can post.
            username: req.currentUser!.username,
            email: req.currentUser!.avatarColor,
            profilePicture,
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            commentsCount: 0,
            imgVersion: '',
            imgId: '',
            createdAt: new Date(),
            reactions: {like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0}
        } as unknown as IPostDocument;

        socketIOPostObject.emit('add post', createdPost);

        // Saving the new post on cache
        await postCache.savePostToCache({
            key: postObjectId,
            currentUserId: `${req.currentUser!.userId}`,
            uId: `${req.currentUser!.uId}`,
            createdPost: createdPost
        });

        // Add Queue Job
        postQueue.addPostJob('addPostToDB', {key: req.currentUser!.userId, value: createdPost});
        res.status(HTTP_STATUS.CREATED).json({message: 'Post created successfully'});
    }

    @JoiValidation(postWithImageSchema)
    public async postWithImage(req: Request, res: Response): Promise<void> {
        const {post, bgColor, privacy, gifUrl, profilePicture, feelings, image} = req.body;

        // Upload post image via Cloudinary
        const result: UploadApiResponse = await uploads(image) as UploadApiResponse;
        if (!result?.public_id) {
            throw new BadRequestError(result.message);
        }

        const postObjectId: ObjectId = new ObjectId();
        const createdPost: IPostDocument = {
            _id: postObjectId,
            userId: req.currentUser!.userId,
            username: req.currentUser!.username,
            email: req.currentUser!.avatarColor,
            profilePicture,
            post,
            bgColor,
            feelings,
            privacy,
            gifUrl,
            commentsCount: 0,
            imgVersion: result.version?.toString(),
            imgId: result.public_id,
            createdAt: new Date(),
            reactions: {like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0}
        } as unknown as IPostDocument;

        socketIOPostObject.emit('add post', createdPost);

        // Saving the new post on cache
        await postCache.savePostToCache({
            key: postObjectId,
            currentUserId: `${req.currentUser!.userId}`,
            uId: `${req.currentUser!.uId}`,
            createdPost: createdPost
        });

        // Add Queue Job
        postQueue.addPostJob('addPostToDB', {key: req.currentUser!.userId, value: createdPost});
        // TODO: Call Image Queue to add image to mongodb database
        res.status(HTTP_STATUS.CREATED).json({message: 'Post created with image successfully'});
    }
}