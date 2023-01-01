import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';
import { postSchema } from '@root/features/post/schemes/post.schemes';
import { IPostDocument } from '@root/features/post/interfaces/post.interface';

export class Create {
    @JoiValidation(postSchema)
    public async post(req: Request, res: Response): Promise<void> {
        const {post, bgColor, privacy, gifUrl, profilePicture, feelings} = req.body;

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
            commentCount: 0,
            imgVersion: '',
            imgId: '',
            createdAt: new Date(),
            reactions: {like: 0, love: 0, happy: 0, sad: 0, wow: 0, angry: 0}
        } as unknown as IPostDocument;

        res.status(HTTP_STATUS.CREATED).json({message: 'Post created successfully'});
    }
}