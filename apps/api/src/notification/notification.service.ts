import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>
  ) {}

  async createNotification(notificationData: {
    userId: string;
    title: string;
    message?: string;
    type: 'info' | 'success' | 'warning' | 'error';
    actionUrl?: string;
    projectId?: string;
    ticketId?: string;
    metadata?: Record<string, any>;
  }) {
    const notification = new this.notificationModel(notificationData);
    return notification.save();
  }

  async getUserNotifications(userId: string, limit = 20) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany(
      { userId, read: false },
      { read: true }
    );
  }

  async getUnreadCount(userId: string) {
    return this.notificationModel.countDocuments({ userId, read: false });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.notificationModel.findOneAndDelete({ _id: notificationId, userId });
  }
} 