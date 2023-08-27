import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { socketIONotificationObject } from '@socket/notification.socket';
import { notificationQueue } from '@service/queues/notification.queue';

export class Update {
    public async notification(req: Request, res: Response): Promise<void> {
        const {notificationId} = req.params;
        socketIONotificationObject.emit('update notification', req.params.notificationId);
        notificationQueue.addNotificationJob('updateNotification', {key: notificationId});
        res.status(HTTP_STATUS.OK).json({message: 'Notification marked as read'});
    }
}