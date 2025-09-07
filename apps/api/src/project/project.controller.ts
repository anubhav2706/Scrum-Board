import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProjectService } from './project.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateProjectDto } from './project.dto';

@Controller('projects')
@UseGuards(FirebaseAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getAllProjects(@Request() req: any) {
    return this.projectService.findAll();
  }

  @Post()
  async createProject(@Body() dto: CreateProjectDto, @Request() req: any) {
    return this.projectService.create({
      ...dto,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
    });
  }
} 