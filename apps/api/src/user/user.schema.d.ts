import { Document } from 'mongoose';
import { IUser } from '../../../../packages/types/index';
export declare class User extends Document implements IUser {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'developer' | 'tester';
    photoURL?: string;
    createdAt: string;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
