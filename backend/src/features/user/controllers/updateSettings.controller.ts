import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Helpers } from '@global/helpers/helpers';
import { userService } from '@service/db/user.service';
import { notificationSettingsSchema } from '@user/schemes/info';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';
import { UserCache } from '@service/redis/user.cache';
import { userQueue } from '@service/queues/user.queue';

const userCache: UserCache = new UserCache();

export class UpdateSettings {

    @JoiValidation(notificationSettingsSchema)
    public async notifications(req: Request, res: Response): Promise<void> {
        await userCache.updateSingleUserItemInCache(`${req.currentUser?.userId}`, 'notifications', req.body);
        userQueue.addUserJob('updateNotificationSettingsInDB', {key: `${req.currentUser?.userId}`, value: req.body});

        res.status(HTTP_STATUS.OK).json({message: 'Notification settings updated successfully', settings: req.body});
    }
}