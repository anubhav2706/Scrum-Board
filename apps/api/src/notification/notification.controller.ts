import { Controller, Get, Put, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    uid: string;
  };
}

@Controller('notifications')
@UseGuards(FirebaseAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Request() req: AuthenticatedRequest) {
    return this.notificationService.getUserNotifications(req.user.uid);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: AuthenticatedRequest) {
    const count = await this.notificationService.getUnreadCount(req.user.uid);
    return { count };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notificationService.markAsRead(id, req.user.uid);
  }

  @Put('mark-all-read')
  async markAllAsRead(@Request() req: AuthenticatedRequest) {
    return this.notificationService.markAllAsRead(req.user.uid);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notificationService.deleteNotification(id, req.user.uid);
  }
} 