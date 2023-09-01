import mongoose from 'mongoose';
import { UserModel } from '@user/models/user.schema';
import { ImageModel } from '@image/models/image.schema';

class ImageService {
    public async addUserProfileImageToDB(userId: string, url: string, imgId: string, imgVersion: string): Promise<void> {
        await UserModel.updateOne({_id: userId}, {$set: {profilePicture: url}}).exec();
        await this.addImage(userId, imgId, imgVersion, 'profile');
    }

    public async addBackgroundImageToDB(userId: string, url: string, imgId: string, imgVersion: string): Promise<void> {
        await UserModel.updateOne({_id: userId}, {$set: {bgImageId: imgId, bgImageVersion: imgVersion}}).exec();
        await this.addImage(userId, imgId, imgVersion, 'background');
    }

    public async addImage(userId: string, imgId: string, imgVersion: string, type: string): Promise<void> {
        await ImageModel.create({
            userId,
            bgImageVersion: type === 'background' ? imgVersion : '',
            bgImageId: type === 'background' ? imgId : '',
            imgVersion: type === 'profile' ? imgVersion : '',
            imgId: type === 'profile' ? imgId : '',
        });
    }

    public async removeImageFromDB(imageId: string): Promise<void> {
        await ImageModel.deleteOne({_id: imageId}).exec();
    }
}


export const imageService: ImageService = new ImageService();