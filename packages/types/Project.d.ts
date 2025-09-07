import { IUser } from './User';
export interface IProject {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    members: IUser[];
    createdAt: string;
}
