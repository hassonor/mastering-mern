/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { CustomError } from '@global/helpers/error-handler';
import { SignInController } from '@auth/controllers/signin.controller';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { mergedAuthAndUserData } from '@root/mocks/user.mock';
import HTTP_STATUS from 'http-status-codes';

const VALID_USERNAME = 'Manny';
const VALID_PASSWORD = 'manny1234'; // Aligned with Joi schema
const WRONG_USERNAME = 'ma'; // Less than minimum length
const WRONG_PASSWORD = 'short'; // Less than minimum length
const LONG_USERNAME = 'usernameExceedingMaxLength'; // More than maximum length
const LONG_PASSWORD = 'passwordExceedingMaxLength1234'; // More than maximum length

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');

describe('SignIn', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    // Test for empty username
    it('should throw an error if username is not available', () => {
        const req: Request = authMockRequest({}, {username: '', password: VALID_PASSWORD}) as Request;
        const res: Response = authMockResponse();
        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Username is a required field');
        });
    });

    // Test for username length less than minimum
    it('should throw an error if username length is less than minimum length', () => {
        const req: Request = authMockRequest({}, {username: WRONG_USERNAME, password: VALID_PASSWORD}) as Request;
        const res: Response = authMockResponse();
        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });

    // Test for username length greater than maximum
    it('should throw an error if username length is greater than maximum length', () => {
        const req: Request = authMockRequest({}, {username: LONG_USERNAME, password: VALID_PASSWORD}) as Request;
        const res: Response = authMockResponse();
        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid username');
        });
    });

    // Test for empty password
    it('should throw an error if password is not available', () => {
        const req: Request = authMockRequest({}, {username: VALID_USERNAME, password: ''}) as Request;
        const res: Response = authMockResponse();
        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password is a required field');
        });
    });

    // Test for password length less than minimum
    it('should throw an error if password length is less than minimum length', () => {
        const req: Request = authMockRequest({}, {username: VALID_USERNAME, password: WRONG_PASSWORD}) as Request;
        const res: Response = authMockResponse();
        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password must have a minimum length of 8 characters');
        });
    });

    // Test for password length greater than maximum
    it('should throw an error if password length is greater than maximum length', () => {
        const req: Request = authMockRequest({}, {username: VALID_USERNAME, password: LONG_PASSWORD}) as Request;
        const res: Response = authMockResponse();
        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Password should have a maximum length of 20 characters');
        });
    });


    // Test for unsuccessful login due to incorrect password
    it('should throw "Invalid credentials" for incorrect password', () => {
        const req: Request = authMockRequest({}, {username: VALID_USERNAME, password: 'incorrectPassword'}) as Request;
        const res: Response = authMockResponse();
        authMock.comparePassword = () => Promise.resolve(false);
        jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValue(authMock);

        SignInController.prototype.read(req, res).catch((error: CustomError) => {
            expect(error.statusCode).toEqual(400);
            expect(error.serializeErrors().message).toEqual('Invalid credentials');
        });
    });

    it('should set session data for valid credentials and send correct json response', async () => {
        const req: Request = authMockRequest({}, {username: VALID_USERNAME, password: VALID_PASSWORD}) as Request;
        const res: Response = authMockResponse();
        authMock.comparePassword = () => Promise.resolve(true);
        jest.spyOn(authService, 'getAuthUserByUsername').mockResolvedValue(authMock);
        jest.spyOn(userService, 'getUserByAuthId').mockResolvedValue(mergedAuthAndUserData);

        await SignInController.prototype.read(req, res);
        expect(req.session?.jwt).toBeDefined();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'User login successfully',
            user: mergedAuthAndUserData,
            token: req.session?.jwt
        });
    });


});
