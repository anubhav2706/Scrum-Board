import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TicketStatus, TicketPriority } from '../../../../packages/types/index';

@Schema({ timestamps: true })
export class Ticket extends Document {
  // @Prop({ required: true, unique: true })
  // id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  projectId: string;

  @Prop({ type: [{ type: String, ref: 'User' }], default: [] })
  assignees: string[];

  @Prop({ required: true, enum: ['todo', 'in-progress', 'done'], default: 'todo' })
  status: TicketStatus;

  @Prop({ required: true, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' })
  priority: TicketPriority;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  dueDate?: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ required: true })
  updatedAt: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket); 