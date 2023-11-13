import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';
import { MessageCache } from '@service/redis/message.cache';
import { IMessageData } from '@chat/interfaces/chat.interface';
import { socketIOChatObject } from '@socket/chat.socket';
import { chatQueue } from '@service/queues/chat.queue';
import { markChatSchema } from '@chat/schemes/chat.schemes';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';

const messageCache: MessageCache = new MessageCache();

export class Update {
    @JoiValidation(markChatSchema)
    public async message(req: Request, res: Response): Promise<void> {
        const {senderId, receiverId} = req.body;
        const updatedMessage: IMessageData = await messageCache.updateChatMessages(`${senderId}`, `${receiverId}`);

        socketIOChatObject.emit('message read', updatedMessage);
        socketIOChatObject.emit('chat list', updatedMessage);

        chatQueue.addChatJob('markMessageAsReadInDB', {
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId)
        });

        res.status(HTTP_STATUS.OK).json({message: 'Message marked as read'});
    }
}