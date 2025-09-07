import { IUser } from './User';

export interface IComment {
  id: string;
  ticketId: string;
  author: IUser;
  message: string;
  createdAt: string;
} 