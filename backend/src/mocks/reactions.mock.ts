import {Response} from 'express';
import {AuthPayload} from '@auth/interfaces/auth.interface';
import {IReactionDocument, IReactions} from '@reaction/interfaces/reaction.interface';
import {IJWT} from './auth.mock';
import {ICommentDocument, ICommentNameList} from '@comment/interfaces/comment.interface';


export const reactionMockRequest = (sessionData: IJWT, body: IBody, currentUser?: AuthPayload | null, params?: IParams) => ({
    session: sessionData,
    body,
    params,
    currentUser
});

export const reactionMockResponse = (): Response => {
    const res: Response = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

export interface IBody {
    postId?: string;
    comment?: string;
    profilePicture?: string;
    userTo?: string;
    type?: string;
    previousReaction?: string;
    postReactions?: IReactions;
}

export interface IParams {
    postId?: string;
    page?: string;
    commentId?: string;
    reactionId?: string;
    previousReaction?: string;
    username?: string;
    postReactions?: string;
}

export const reactionData: IReactionDocument = {
    _id: '6064861bc25eaa5a5d2f9bf4',
    username: 'OrHasson',
    postId: '6027f77087c9d9ccb1555268',
    profilePicture: 'https://res.cloudinary.com/orh/image/upload/v1683978037/645f77329390f0651d41430d',
    comment: 'This is a comment',
    createdAt: new Date(),
    userTo: '60263f14648fed5246e322d9',
    type: 'love'
} as IReactionDocument;


export const commentsData: ICommentDocument = {
    _id: '6064861bc25eaa5a5d2f9bf4',
    username: 'OrHasson',
    avatarColor: '#9c27b0',
    postId: '6027f77087c9d9ccb1555268',
    profilePicture: 'https://res.cloudinary.com/orh/image/upload/v1683978037/645f77329390f0651d41430d',
    comment: 'This is a comment',
    createdAt: new Date(),
    userTo: '60263f14648fed5246e322d9'
} as unknown as ICommentDocument;

export const commentNames: ICommentNameList = {
    count: 1,
    names: ['OrHasson']
};

