import { BaseQueue } from '@service/queues/base.queue';
import { IChatJobData, IMessageData } from '@chat/interfaces/chat.interface';
import { chatWorker } from '@worker/chat.worker';


class ChatQueue extends BaseQueue {
    constructor() {
        super('chat');
        this.processJob('addChatMessageToDB', 5, chatWorker.addChatMessageToDB);
    }

    public addChatJob(name: string, data: IChatJobData | IMessageData): void {
        this.addJob(name, data);
    }

}

export const chatQueue: ChatQueue = new ChatQueue();