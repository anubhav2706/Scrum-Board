import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  message: string;

  @Prop({ required: true, enum: ['info', 'success', 'warning', 'error'] })
  type: string;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  actionUrl?: string;

  @Prop()
  projectId?: string;

  @Prop()
  ticketId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification); 