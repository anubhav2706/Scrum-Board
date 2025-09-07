import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ActivityLog extends Document {
  // @Prop({ required: true, unique: true })
  // id: string;

  @Prop({ required: true, enum: ['ticket_created', 'ticket_updated', 'comment_added'] })
  type: string;

  @Prop({ required: true })
  user: string; // userId

  @Prop()
  ticketId?: string;

  @Prop()
  projectId?: string;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog); 