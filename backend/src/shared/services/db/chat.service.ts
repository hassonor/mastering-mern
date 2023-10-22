import { IMessageData } from '@chat/interfaces/chat.interface';
import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/chat.schema';
import { ObjectId } from 'mongodb';

class ChatService {
    public async addMessageToDB(data: IMessageData): Promise<void> {
        const conversation: IConversationDocument[] = await ConversationModel.find({_id: data?.conversationId}).exec();
        if (conversation.length === 0) {
            await ConversationModel.create({
                _id: data?.conversationId,
                senderId: data.senderId,
                receiverId: data.receiverId
            });
        }

        await MessageModel.create({
            _id: data._id,
            conversationId: data.conversationId,
            receiverId: data.receiverId,
            receiverUsername: data.receiverUsername,
            receiverAvatarColor: data.receiverAvatarColor,
            receiverProfilePicture: data.receiverProfilePicture,
            senderUsername: data.senderUsername,
            senderId: data.senderId,
            senderAvatarColor: data.senderAvatarColor,
            senderProfilePicture: data.senderProfilePicture,
            body: data.body,
            isRead: data.isRead,
            gifUrl: data.gifUrl,
            selectedImage: data.selectedImage,
            reaction: data.reaction,
            createdAt: data.createdAt
        });
    }

    public async getUserConversationList(userId: ObjectId): Promise<IMessageData[]> {
        const messages: IMessageData[] = await MessageModel.aggregate([
            {$match: {$or: [{senderId: userId}, {receiverId: userId}]}},
            {
                $group: {
                    _id: '$conversationId',
                    result: {$last: '$$ROOT'}
                }
            },
            {
                $project: {
                    _id: '$result._id',
                    conversationId: '$result.conversationId',
                    receiverId: '$result.receiverId',
                    receiverUsername: '$result.receiverUsername',
                    receiverAvatarColor: '$result.receiverAvatarColor',
                    receiverProfilePicture: '$result.receiverProfilePicture',
                    senderUsername: '$result.senderUsername',
                    senderId: '$result.senderId',
                    senderAvatarColor: '$result.senderAvatarColor',
                    senderProfilePicture: '$result.senderProfilePicture',
                    body: '$result.body',
                    isRead: '$result.isRead',
                    gifUrl: '$result.gifUrl',
                    selectedImage: '$result.selectedImage',
                    reaction: '$result.reaction',
                    createdAt: '$result.createdAt'
                }
            },
            {$sort: {createdAt: 1}}
        ]);
        return messages;
    }
}


export const chatService: ChatService = new ChatService();