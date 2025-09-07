import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import { IUser } from '../../../../packages/types/index';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async syncUser(user: IUser): Promise<User> {
    // Try to find by id or email
    let dbUser = await this.userModel.findOne({ $or: [{ id: user.id }, { email: user.email }] });
    if (dbUser) {
      // Update user fields if needed
      dbUser.id = user.id;
      dbUser.name = user.name;
      dbUser.role = user.role;
      dbUser.photoURL = user.photoURL;
      dbUser.createdAt = user.createdAt;
      await dbUser.save();
    } else {
      dbUser = await this.userModel.create(user);
    }
    return dbUser;
  }
} 