import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../../../../packages/types/index';

@Schema({ timestamps: true })
export class User extends Document implements IUser {
  declare id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['admin', 'developer', 'tester'], default: 'developer' })
  role: 'admin' | 'developer' | 'tester';

  @Prop()
  photoURL?: string;

  @Prop({ required: true })
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 