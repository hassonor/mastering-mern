import { BaseQueue } from '@service/queues/base.queue';
import { userWorker } from '@worker/user.worker';
import { IUserJob } from '@user/interfaces/user.interface';

class UserQueue extends BaseQueue {
    constructor() {
        super('user');
        this.processJob('addUserToDB', 5, userWorker.addUserToDB);
        this.processJob('updateUserInfoInDB', 5, userWorker.updateUserInfo);
        this.processJob('updateSocialLinksInDB', 5, userWorker.updateSocialLinks);
    }

    public addUserJob(name: string, data: IUserJob): void {
        this.addJob(name, data);
    }

}

export const userQueue: UserQueue = new UserQueue();