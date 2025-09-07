import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  // @Prop({ required: true, unique: true })
  // id: string;

  @Prop({ required: true })
  ticketId: string;

  @Prop({ required: true })
  author: string; // userId

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  createdAt: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment); 