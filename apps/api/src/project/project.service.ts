import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.schema';
import { IProject } from '../../../../packages/types/index';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async findAll(): Promise<IProject[]> {
    const projects = await this.projectModel.find().lean();
    return projects.map(project => ({
      ...project,
      id: project._id?.toString() || project.id,
    }));
  }

  async create(createProjectDto: any): Promise<IProject> {
    const project = new this.projectModel(createProjectDto);
    const savedProject = await project.save();
    return {
      ...savedProject.toObject(),
      id: savedProject._id?.toString() || savedProject.id,
    };
  }

  async searchProjects(searchRegex: RegExp): Promise<IProject[]> {
    const projects = await this.projectModel.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10).lean();
    
    return projects.map(project => ({
      ...project,
      id: project._id?.toString() || project.id,
    }));
  }
} 