import {Response} from 'express';
import {IJWT} from './auth.mock';
import {AuthPayload} from '@auth/interfaces/auth.interface';
import {existingUserTwo} from '@root/mocks/user.mock';
import mongoose from 'mongoose';
import {IFollowerData} from '@follower/interfaces/follower.interface';

export const followersMockRequest = (sessionData: IJWT, currentUser?: AuthPayload | null, params?: IParams) => ({
    session: sessionData,
    params,
    currentUser
});

export const followersMockResponse = (): Response => {
    const res: Response = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

export interface IParams {
    followerId?: string;
    followedUserId?: string;
    userId?: string;
}

export const mockFollowerData: IFollowerData = {
    avatarColor: `${existingUserTwo.avatarColor}`,
    followersCount: existingUserTwo.followersCount,
    followingCount: existingUserTwo.followingCount,
    profilePicture: `${existingUserTwo.profilePicture}`,
    postCount: existingUserTwo.postsCount,
    username: `${existingUserTwo.username}`,
    uId: `${existingUserTwo.uId}`,
    _id: new mongoose.Types.ObjectId(existingUserTwo._id)
};

export const followerData = {
    _id: '60263f14648fed5246e32e13',
    followerId: {
        username: 'hassonor',
        postCount: 5,
        avatarColor: '#9c27b0',
        followersCount: 3,
        followingCount: 5,
        profilePicture: 'cloudinarylink... to image'
    },
    followeeId: {
        username: 'Danny',
        postCount: 10,
        avatarColor: '#ff9800',
        followersCount: 3,
        followingCount: 5,
        profilePicture: 'https://res.cloudinary.com/ratingapp/image/upload/605727cd646eb50e668a4e13'
    }
};
