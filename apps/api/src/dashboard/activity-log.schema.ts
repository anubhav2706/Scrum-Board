import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  projectId: string;

  @Prop({ required: true })
  action: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog); 