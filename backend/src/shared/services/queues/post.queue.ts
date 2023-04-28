import { BaseQueue } from '@service/queues/base.queue';
import { IPostJobData } from '@root/features/post/interfaces/post.interface';
import { postWorker } from '@worker/post.worker';

class PostQueue extends BaseQueue {
    constructor() {
        super('posts');
        /**
         *  1st arg: 'addPostToDB'  - name of the job.
         *  2nd arg: number of concurrency.
         *  3rd arg: postWorker.savePostToDB job.
         */
        this.processJob('addPostToDB', 5, postWorker.savePostToDB);
    }

    public addPostJob(name: string, data: IPostJobData): void {
        this.addJob(name, data);
    }

}

export const postQueue: PostQueue = new PostQueue();