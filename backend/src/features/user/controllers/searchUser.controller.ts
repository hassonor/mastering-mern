import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { Helpers } from '@global/helpers/helpers';
import { userService } from '@service/db/user.service';
import { ISearchUser } from '@user/interfaces/user.interface';

export class Search {
    public async users(req: Request, res: Response): Promise<void> {
        const regexValue = new RegExp(Helpers.escapeRegex(req.params.query), 'i');
        const users: ISearchUser[] = await userService.searchUsers(regexValue);

        res.status(HTTP_STATUS.OK).json({message: 'Search results', users});
    }
}