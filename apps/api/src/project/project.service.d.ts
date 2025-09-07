import { Model } from 'mongoose';
import { Project } from './project.schema';
import { IUser } from '../../../../packages/types/index';
import { CreateProjectDto } from './project.dto';
export declare class ProjectService {
    private projectModel;
    constructor(projectModel: Model<Project>);
    findAllForUser(userId: string): Promise<Project[]>;
    createProject(dto: CreateProjectDto, user: IUser): Promise<Project>;
}
