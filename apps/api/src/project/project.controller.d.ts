import { ProjectService } from './project.service';
import { CreateProjectDto } from './project.dto';
import { Request } from 'express';
import { IUser } from '../../../../packages/types/index';
export declare class ProjectController {
    private readonly projectService;
    constructor(projectService: ProjectService);
    getProjects(req: Request & {
        user?: IUser;
    }): Promise<import("./project.schema").Project[]>;
    createProject(dto: CreateProjectDto, req: Request & {
        user?: IUser;
    }): Promise<import("./project.schema").Project>;
}
