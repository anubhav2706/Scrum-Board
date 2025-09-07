import { IUser } from './User';

export interface IProject {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // userId
  members: IUser[];
  createdAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
} 