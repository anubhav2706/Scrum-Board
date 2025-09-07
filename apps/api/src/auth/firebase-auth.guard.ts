import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '../../../../packages/types/index';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: any,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request & { user?: IUser }>();
    const authHeader = req.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('No auth token');
    const token = authHeader.split(' ')[1];
    try {
      const decoded = await this.firebaseAdmin.auth().verifyIdToken(token);
      req.user = {
        id: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role || 'developer',
        photoURL: decoded.picture,
        createdAt: decoded.auth_time ? new Date(decoded.auth_time * 1000).toISOString() : '',
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }
} 