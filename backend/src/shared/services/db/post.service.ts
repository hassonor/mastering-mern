import { IPostDocument } from '@root/features/post/interfaces/post.interface';
import { PostModel } from '@root/features/post/models/post.schema';
import { UpdateQuery } from 'mongoose';
import { IUserDocument } from '@post/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';


class PostService {
    public async addPostToDBService(userId: string, createdPost: IPostDocument): Promise<void> {
        const post: Promise<IPostDocument> = PostModel.create(createdPost);
        const user: UpdateQuery<IUserDocument> = UserModel.updateOne({_id: userId}, {$inc: {postsCount: 1}}); // increment postsCount property by 1
        await Promise.all([post, user]);
    }
}


export const postService: PostService = new PostService();