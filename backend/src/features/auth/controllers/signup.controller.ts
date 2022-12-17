import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { JoiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import HTTP_STATUS from 'http-status-codes';

export class SignupController {
    @JoiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const {username, email, password, avatarColor, avatarImage} = req.body;
        const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('The user already exist');
        }

        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData: IAuthDocument = SignupController.prototype.signUpData({
            _id: authObjectId, uId, username, email, password, avatarColor
        });

        const result: UploadApiResponse = await uploads(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
        if (!result?.public_id) {
            throw new BadRequestError('File upload: Error occured. Try again.');
        }

        res.status(HTTP_STATUS.CREATED).json({message: 'User were created successfully', authData});
    }

    private signUpData(data: ISignUpData): IAuthDocument {
        const {_id, username, email, uId, password, avatarColor} = data;
        return {
            _id,
            username: Helpers.firstLetterUppercase(username),
            email: Helpers.lowerCase(email),
            uId,
            password,
            avatarColor,
            createdAt: new Date()
        } as IAuthDocument;
    }
}