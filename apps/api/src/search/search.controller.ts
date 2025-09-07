import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { SearchService } from './search.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
  };
}

@Controller('search')
@UseGuards(FirebaseAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('global')
  async globalSearch(@Query('q') query: string, @Request() req: AuthenticatedRequest) {
    return this.searchService.globalSearch(query, req.user.uid);
  }

  @Get('projects')
  async searchProjects(@Query('q') query: string) {
    return this.searchService.searchProjects(query);
  }

  @Get('tickets')
  async searchTickets(@Query('q') query: string) {
    return this.searchService.searchTickets(query);
  }

  @Get('users')
  async searchUsers(@Query('q') query: string) {
    return this.searchService.searchUsers(query);
  }
} 