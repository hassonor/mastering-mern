import { IMessageData } from '@chat/interfaces/chat.interface';
import { IConversationDocument } from '@chat/interfaces/conversation.interface';
import { ConversationModel } from '@chat/models/conversation.schema';
import { MessageModel } from '@chat/models/chat.schema';

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
}


export const chatService: ChatService = new ChatService();