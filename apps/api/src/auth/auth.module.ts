import { Module, forwardRef, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAdminModule } from './firebase-admin.module';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [forwardRef(() => UserModule), FirebaseAdminModule],
  controllers: [AuthController],
  providers: [AuthService, FirebaseAuthGuard],
  exports: [AuthService, FirebaseAuthGuard, FirebaseAdminModule], // 👈 export it
})
export class AuthModule {}
