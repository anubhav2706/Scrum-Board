import { Injectable } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { TicketService } from '../ticket/ticket.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly ticketService: TicketService,
    private readonly userService: UserService,
  ) {}

  async globalSearch(query: string, userId: string) {
    if (!query || query.trim().length < 2) {
      return {
        projects: [],
        tickets: [],
        users: [],
      };
    }

    const searchRegex = new RegExp(query, 'i');

    // Search projects
    const projects = await this.projectService.searchProjects(searchRegex);

    // Search tickets
    const tickets = await this.ticketService.searchTickets(searchRegex);

    // Search users
    const users = await this.userService.searchUsers(query);

    return {
      projects,
      tickets,
      users,
    };
  }

  async searchProjects(query: string) {
    return this.projectService.searchProjects(new RegExp(query, 'i'));
  }

  async searchTickets(query: string) {
    return this.ticketService.searchTickets(new RegExp(query, 'i'));
  }

  async searchUsers(query: string) {
    return this.userService.searchUsers(query);
  }
} 