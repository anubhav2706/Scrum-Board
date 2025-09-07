import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProjectService } from '../project/project.service';
import { TicketService } from '../ticket/ticket.service';
import { UserService } from '../user/user.service';
import { ActivityLog, ActivityLogDocument } from './activity-log.schema';

@Injectable()
export class DashboardService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
    @InjectModel(ActivityLog.name) private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async getDashboardSummary(userId: string) {
    // Get user's projects
    const projects = await this.projectService.findAll();
    
    // Create a map of all team members
    const memberMap = new Map();
    const allUsers = await this.userService.findAll();
    allUsers.forEach(user => memberMap.set(user.id, user));
    
    // Get tickets for each project
    const projectStats = await Promise.all(
      projects.map(async (project: any) => {
        const tickets = await this.ticketService.findByProject(project.id);
        
        const ticketStats = tickets.map((ticket: any) => ({
          id: ticket.id,
          title: ticket.title,
          status: ticket.status,
          priority: ticket.priority,
          assignees: ticket.assignees?.map((assignee: any) => memberMap.get(assignee.id)) || [],
        }));

        const totalTickets = tickets.length;
        const completedTickets = tickets.filter((t: any) => t.status === 'done').length;
        const inProgressTickets = tickets.filter((t: any) => t.status === 'in-progress').length;
        const todoTickets = tickets.filter((t: any) => t.status === 'todo').length;

        return {
          id: project.id,
          name: project.name,
          description: project.description,
          totalTickets,
          completedTickets,
          inProgressTickets,
          todoTickets,
          completionRate: totalTickets > 0 ? (completedTickets / totalTickets) * 100 : 0,
          tickets: ticketStats,
        };
      })
    );

    // Get recent activity
    const activityLogs = await this.activityLogModel.find({ projectId: { $in: projects.map((p: any) => p.id) } })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      projects: projectStats,
      recentActivity: activityLogs,
      totalProjects: projects.length,
      totalTickets: projectStats.reduce((sum, project) => sum + project.totalTickets, 0),
      completedTickets: projectStats.reduce((sum, project) => sum + project.completedTickets, 0),
    };
  }
} 