import { Request } from 'express';
import { IUser } from '../../../../packages/types/index';
export declare class AuthController {
    getProfile(req: Request & {
        user?: IUser;
    }): IUser | undefined;
}
