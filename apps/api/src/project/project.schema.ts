import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../../../../packages/types/index';

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true, unique: true })
  declare id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  createdBy: string; // userId

  @Prop({ type: [Object], required: true })
  members: IUser[]; // Store full user objects

  @Prop({ required: true })
  createdAt: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project); 