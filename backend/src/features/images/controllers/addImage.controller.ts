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
import { IBgUploadResponse } from '@image/interfaces/image.interface';
import { Helpers } from '@global/helpers/helpers';

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


    @JoiValidation(addImageSchema)
    public async backgroundImage(req: Request, res: Response): Promise<void> {
        const {version, publicId}: IBgUploadResponse = await Add.prototype.backgroundUpload(req.body.image);

        const bgImageId: Promise<IUserDocument> = await userCache.updateSingleUserItemInCache(
            `${req.currentUser!.userId}`,
            'bgImageId',
            publicId
        ) as unknown as Promise<IUserDocument>;

        const bgImageVersion: Promise<IUserDocument> = await userCache.updateSingleUserItemInCache(
            `${req.currentUser!.userId}`,
            'bgImageVersion',
            version
        ) as unknown as Promise<IUserDocument>;

        const response: [IUserDocument, IUserDocument] = await Promise.all([bgImageId, bgImageVersion]) as [IUserDocument, IUserDocument];

        socketIOImageObject.emit('update user', {
            bgImageId: publicId,
            bgImageVersion: version,
            userId: response[0]
        });


        imageQueue.addImageJob('updateBGImageInDB', {
            key: `${req.currentUser!.userId}`,
            imgId: publicId,
            imgVersion: version.toString()
        });

        res.status(HTTP_STATUS.OK).json({message: 'Image added successfully'});
    }

    private async backgroundUpload(image: string): Promise<IBgUploadResponse> {
        const isDataURL = Helpers.isDataURL(image);
        let version = '';
        let publicId = '';
        if (isDataURL) {
            const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
            if (!result.public_id) {
                throw new BadRequestError(result.message);
            } else {
                version = result.version.toString();
                publicId = result.public_id;
            }
        } else {
            const value = image.split('/');
            version = value[value.length - 2];
            publicId = value[value.length - 1];
        }

        return {version: version.replace(/v/g, ''), publicId};
    }
}