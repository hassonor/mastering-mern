import { BaseCache } from '@service/redis/base.cache';
import Logger from 'bunyan';
import { filter, find, findIndex } from 'lodash';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { IChatList, IChatUsers, IGetMessageFromCache, IMessageData } from '@chat/interfaces/chat.interface';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('messageCache');

export class MessageCache extends BaseCache {
    constructor() {
        super('messageCache');
    }

    public async addChatListToCache(senderId: string, receiverId: string, conversationId: string): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const userChatList = await this.client.LRANGE(`chatList:${senderId}`, 0, -1);
            if (userChatList.length === 0) {
                await this.client.RPUSH(`chatList:${senderId}`, JSON.stringify({receiverId, conversationId}));
            } else {
                const receiverIndex: number = findIndex(userChatList, (listItem: string) => listItem.includes(receiverId));
                if (receiverIndex < 0) {
                    await this.client.RPUSH(`chatList:${senderId}`, JSON.stringify({receiverId, conversationId}));
                }
            }
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async addChatMessageToCache(conversationId: string, value: IMessageData): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            await this.client.RPUSH(`messages:${conversationId}`, JSON.stringify(value));
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async addChatUsersToCache(value: IChatUsers): Promise<IChatUsers[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const users: IChatUsers[] = await this.getChatUserList();
            const userIndex: number = findIndex(users, (listItem: IChatUsers) => JSON.stringify(listItem) === JSON.stringify(value));
            let chatUsers: IChatUsers[] = [];
            if (userIndex === -1) {
                await this.client.RPUSH('chatUsers', JSON.stringify(value));
                chatUsers = await this.getChatUserList();
            } else {
                chatUsers = users;
            }
            return chatUsers;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }


    public async removeChatUsersFromCache(value: IChatUsers): Promise<IChatUsers[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const users: IChatUsers[] = await this.getChatUserList();
            const userIndex: number = findIndex(users, (listItem: IChatUsers) => JSON.stringify(listItem) === JSON.stringify(value));
            let chatUsers: IChatUsers[] = [];
            if (userIndex > -1) {
                await this.client.LREM('chatUsers', userIndex, JSON.stringify(value));
                chatUsers = await this.getChatUserList();
            } else {
                chatUsers = users;
            }
            return chatUsers;
        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async getUserConversationList(key: string): Promise<IMessageData[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const userChatList: string[] = await this.client.LRANGE(`chatList:${key}`, 0, -1);
            const conversationChatList: IMessageData[] = [];
            for (const item of userChatList) {
                const chatItem: IChatList = Helpers.parseJson(item) as IChatList;
                const lastMessage: string = await this.client.LINDEX(`messages:${chatItem.conversationId}`, -1) as string;
                conversationChatList.push(Helpers.parseJson(lastMessage));
            }

            return conversationChatList;


        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async getChatMessagesFromCache(senderId: string, receiverId: string): Promise<IMessageData[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const userChatList: string[] = await this.client.LRANGE(`chatList:${senderId}`, 0, -1);
            const receiver: string = find(userChatList, (listItem: string) => listItem.includes(receiverId)) as string;
            const parsedReceiver: IChatList = Helpers.parseJson(receiver) as IChatList;
            if (parsedReceiver) {
                const userMessages: string[] = await this.client.LRANGE(`messages:${parsedReceiver.conversationId}`, 0, -1);
                const chatMessages: IMessageData[] = [];

                for (const item of userMessages) {
                    const chatItem = Helpers.parseJson(item) as IMessageData;
                    chatMessages.push(chatItem);
                }
                return chatMessages;
            } else {
                return [];
            }

        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async markMessageAsDeleted(senderId: string, receiverId: string, messageId: string, type: string): Promise<IMessageData> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const {index, message, receiver} = await this.getMessage(senderId, receiverId, messageId);
            const chatItem = Helpers.parseJson(message) as IMessageData;

            if (type === 'deleteForMe') {
                chatItem.deleteForMe = true;
            } else {
                chatItem.deleteForMe = true;
                chatItem.deleteForEveryone = true;
            }

            await this.client.LSET(`messages:${receiver.conversationId}`, index, JSON.stringify(chatItem));

            const lastMessage: string = await this.client.LINDEX(`messages:${receiver.conversationId}`, index) as string;

            return Helpers.parseJson(lastMessage) as IMessageData;

        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    public async updateChatMessages(senderId: string, receiverId: string): Promise<IMessageData> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }

            const userChatList: string[] = await this.client.LRANGE(`chatList:${senderId}`, 0, -1);
            const receiver: string = find(userChatList, (listItem: string) => listItem.includes(receiverId)) as string;
            const parsedReceiver: IChatList = Helpers.parseJson(receiver) as IChatList;

            const messages: string[] = await this.client.LRANGE(`messages:${parsedReceiver.conversationId}`, 0, -1);
            const unreadMessages: string[] = filter(messages, (listItem: string) => !Helpers.parseJson(listItem).isRead);

            for (const item of unreadMessages) {
                const chatItem = Helpers.parseJson(item) as IMessageData;
                const index = findIndex(messages, (listItem: string) => listItem.includes(`${chatItem._id}`));
                chatItem.isRead = true;
                await this.client.LSET(`messages:${chatItem.conversationId}`, index, JSON.stringify(chatItem));
            }

            const lastMessage: string = await this.client.LINDEX(`messages:${parsedReceiver.conversationId}`, -1) as string;
            return Helpers.parseJson(lastMessage) as IMessageData;

        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    private async getChatUserList(): Promise<IChatUsers[]> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
            }
            const chatUsersList: IChatUsers[] = [];
            const chatUsers = await this.client.LRANGE('chatUsers', 0, -1);

            for (const item of chatUsers) {
                const chatUser: IChatUsers = Helpers.parseJson(item) as IChatUsers;
                chatUsersList.push(chatUser);
            }

            return chatUsersList;

        } catch (error) {
            log.error(error);
            throw new ServerError('Server error. Try again.');
        }
    }

    private async getMessage(senderId: string, receiverId: string, messageId: string): Promise<IGetMessageFromCache> {
        const userChatList: string[] = await this.client.LRANGE(`chatList:${senderId}`, 0, -1);
        const receiver: string = find(userChatList, (listItem: string) => listItem.includes(receiverId)) as string;
        const parsedReceiver: IChatList = Helpers.parseJson(receiver) as IChatList;
        const messages: string[] = await this.client.LRANGE(`messages:${parsedReceiver.conversationId}`, 0, -1);
        const message: string = find(messages, (listItem: string) => listItem.includes(messageId)) as string;
        const index: number = findIndex(messages, (listItem: string) => listItem.includes(messageId));

        return {index, message, receiver: parsedReceiver};


    }

}