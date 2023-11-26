/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { SignupController } from '@auth/controllers/signup.controller';
import { CustomError } from '@global/helpers/error-handler';

import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/queues/user.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    // Test for empty username
    it('should throw an error if username is not available', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: '',
                email: 'orh@google.com',
                password: 'qwerty1234',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();

        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Username is a required field');
        });
    });

    // Test for username length less than minimum
    it('should throw an error if username length is less than minimum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'ma',
                email: 'orh@google.com',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });

    // Test for username length greater than maximum
    it('should throw an error if username length is greater than maximum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'verylongusernamebeyondthelimit',
                email: 'orh@google.com',
                password: 'qwerty',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });

    // Test for invalid email
    it('should throw an error if email is not valid', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'notavalidemail',
                password: 'qwerty1234',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Email must be valid');
        });
    });

    // Test for empty email
    it('should throw an error if email is not available', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: '',
                password: 'qwerty1234',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Email is a required field');
        });
    });

    // Test for empty password
    it('should throw an error if password is not available', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: '',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password is a required field');
        });
    });

    // Test for password length less than minimum
    it('should throw an error if password length is less than minimum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'short',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password must have a minimum length of 8 characters');
        });
    });

    // Test for password length greater than maximum
    it('should throw an error if password length is greater than maximum length', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'verylongpasswordthatexceedsthemaximumallowed',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password should have a maximum length of 20 characters');
        });
    });

    // Test for user already exists
    it('should throw unauthorized error if user already exists', () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'qwerty1234',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();

        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(authMock);
        SignupController.prototype.create(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('The user already exist');
        });
    });

    // Test for successful signup
    it('should set session data for valid credentials and send correct json response', async () => {
        const req: Request = authMockRequest(
            {},
            {
                username: 'hassonor',
                email: 'orh@google.com',
                password: 'qwerty1234',
                avatarColor: 'red',
                avatarImage: 'data:image/png;base64,...'
            }
        ) as Request;
        const res: Response = authMockResponse();

        jest.spyOn(authService, 'getUserByUsernameOrEmail').mockResolvedValue(null as any);
        const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');
        jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({
            version: '1234737373',
            public_id: '123456'
        }));

        await SignupController.prototype.create(req, res);
        expect(req.session?.jwt).toBeDefined();
        expect(res.json).toHaveBeenCalledWith({
            message: 'User were created successfully',
            user: userSpy.mock.calls[0][2],
            token: req.session?.jwt
        });
    });
});
