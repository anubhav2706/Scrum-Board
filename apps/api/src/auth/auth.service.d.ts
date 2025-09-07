import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { IUser } from '../../../../packages/types/index';
export declare class AuthService {
    private userModel;
    constructor(userModel: Model<User>);
    syncUser(user: IUser): Promise<User>;
}
