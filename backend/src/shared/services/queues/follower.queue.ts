import {BaseQueue} from '@service/queues/base.queue';
import {followerWorker} from '@worker/follower.worker';
import {IFollowerJobData} from '@follower/interfaces/follower.interface';

class FollowerQueue extends BaseQueue {
    constructor() {
        super('followers');
        this.processJob('addFollowerToDB', 5, followerWorker.addFollowerToDB);
        this.processJob('removeFollowerFromDB', 5, followerWorker.removeFollowerFromDB);
    }

    public addFollowerJob(name: string, data: IFollowerJobData): void {
        this.addJob(name, data);
    }
}

export const followerQueue: FollowerQueue = new FollowerQueue();