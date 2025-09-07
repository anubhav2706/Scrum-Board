import { Controller, Get, Put, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UpdateUserDto } from './user.dto';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
  };
}

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get('search')
  async searchUsers(@Query('q') query: string) {
    return this.userService.searchUsers(query);
  }

  @Get('profile')
  async getProfile(@Request() req: AuthenticatedRequest) {
    return this.userService.findByFirebaseId(req.user.uid);
  }

  @Put('profile')
  async updateProfile(@Request() req: AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.uid, updateUserDto);
  }

  @Post('invite')
  async inviteUser(@Body() inviteData: { email: string; projectId?: string }) {
    return this.userService.inviteUser(inviteData);
  }

  @Get('team')
  async getTeamMembers(@Query('projectId') projectId?: string) {
    return this.userService.getTeamMembers(projectId);
  }
} 