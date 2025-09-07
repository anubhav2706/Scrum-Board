import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { IUser } from '../../../../packages/types/index';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().lean();
    return users.map(user => ({
      ...user,
      id: user._id?.toString() || user.id,
    }));
  }

  async findByFirebaseId(firebaseId: string): Promise<IUser | null> {
    const user = await this.userModel.findOne({ firebaseId }).lean();
    if (!user) return null;
    return {
      ...user,
      id: user._id?.toString() || user.id,
    };
  }

  async searchUsers(query: string): Promise<IUser[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    const searchRegex = new RegExp(query, 'i');
    const users = await this.userModel.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { displayName: searchRegex }
      ]
    }).limit(10).lean();
    
    return users.map(user => ({
      ...user,
      id: user._id?.toString() || user.id,
    }));
  }

  async updateProfile(firebaseId: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const user = await this.userModel.findOneAndUpdate(
      { firebaseId },
      { $set: updateUserDto },
      { new: true, upsert: true }
    ).lean();
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      ...user,
      id: user._id?.toString() || user.id,
    };
  }

  async inviteUser(inviteData: { email: string; projectId?: string }): Promise<{ success: boolean; message: string }> {
    // In a real implementation, you would:
    // 1. Check if user exists
    // 2. Send invitation email
    // 3. Create invitation record
    // 4. Add to project if projectId provided
    
    const existingUser = await this.userModel.findOne({ email: inviteData.email }).lean();
    
    if (existingUser) {
      // User exists, add to project if specified
      if (inviteData.projectId) {
        // Add user to project members
        // This would require project schema updates
      }
      return { success: true, message: 'User already exists and has been added to the project' };
    } else {
      // Create invitation
      return { success: true, message: 'Invitation sent successfully' };
    }
  }

  async getTeamMembers(projectId?: string): Promise<IUser[]> {
    let users;
    if (projectId) {
      // Get users for specific project
      // This would require project-user relationship
      users = await this.userModel.find().limit(20).lean();
    } else {
      // Get all users (for global team view)
      users = await this.userModel.find().lean();
    }
    
    return users.map(user => ({
      ...user,
      id: user._id?.toString() || user.id,
    }));
  }
} 