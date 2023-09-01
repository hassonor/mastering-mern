import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { UserCache } from '@service/redis/user.cache';
import { addImageSchema } from '@image/schemes/image.schemas';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { IUserDocument } from '@user/interfaces/user.interface';
import { socketIOImageObject } from '@socket/image.socket';
import { imageQueue } from '@service/queues/image.queue';

const userCache: UserCache = new UserCache();

export class Add {
    @JoiValidation(addImageSchema)
    public async profileImage(req: Request, res: Response): Promise<void> {
        const result: UploadApiResponse = (await uploads(req.body.image, req.currentUser!.userId, true, true)) as UploadApiResponse;
        if (!result?.public_id) {
            throw new BadRequestError('File upload: Error occurred. Try again.');
        }

        const url = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${result.public_id}`;

        const cachedUser: IUserDocument | null = await userCache.updateSingleUserItemInCache(
            `${req.currentUser!.userId}`,
            'profilePicture',
            url
        ) as IUserDocument;
        socketIOImageObject.emit('update user', cachedUser);
        imageQueue.addImageJob('addUserProfileImageToDB', {
            key: `${req.currentUser!.userId}`,
            value: url,
            imgId: result.public_id,
            imgVersion: result.version.toString()
        });

        res.status(HTTP_STATUS.OK).json({message: 'Image added successfully'});
    }
}