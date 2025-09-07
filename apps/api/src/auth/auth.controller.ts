import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { IUser } from '../../../../packages/types/index';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getProfile(@Req() req: Request & { user?: IUser }) {
    if (req.user) {
      await this.authService.syncUser(req.user);
    }
    return req.user;
  }
} 