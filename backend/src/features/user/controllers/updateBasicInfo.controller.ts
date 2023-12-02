import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Helpers } from '@global/helpers/helpers';
import { userService } from '@service/db/user.service';
import { UserCache } from '@service/redis/user.cache';
import { userQueue } from '@service/queues/user.queue';
import { basicInfoSchema, socialLinksSchema } from '@user/schemes/info';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';

const userCache: UserCache = new UserCache();

export class Update {
    @JoiValidation(basicInfoSchema)
    public async info(req: Request, res: Response): Promise<void> {
        for (const [key, value] of Object.entries(req.body)) {
            await userCache.updateSingleUserItemInCache(`${req.currentUser?.userId}`, key, `${value}`);
        }

        userQueue.addUserJob('updateBasicInfoInDB', {
            key: req.currentUser?.userId,
            value: req.body
        });

        res.status(HTTP_STATUS.OK).json({message: 'User info updated successfully'});
    }

    @JoiValidation(socialLinksSchema)
    public async social(req: Request, res: Response): Promise<void> {
        await userCache.updateSingleUserItemInCache(`${req.currentUser?.userId}`, 'social', req.body);
        userQueue.addUserJob('updateSocialLinksInDB', {
            key: req.currentUser?.userId,
            value: req.body
        });

        res.status(HTTP_STATUS.OK).json({message: 'User Social links updated successfully'});
    }

}