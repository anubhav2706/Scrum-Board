import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './common/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { TicketModule } from './ticket/ticket.module';
import { WsModule } from './ws/ws.module';
import { CommonModule } from './common/common.module';
import { FirebaseAdminModule } from './auth/firebase-admin.module';
import { TicketGateway } from './ws/ticket.gateway';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationModule } from './notification/notification.module';
import { SearchModule } from './search/search.module';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'], // add correct location(s)
      ignoreEnvFile: false,
    }),
    
    DatabaseModule,
    AuthModule,
    UserModule,
    ProjectModule,
    TicketModule,
    WsModule,
    CommonModule,
    FirebaseAdminModule, // <-- use the module instead of the provider directly
    DashboardModule, // <-- add here
    NotificationModule,
    SearchModule,
  ],
  providers: [TicketGateway, FirebaseAuthGuard], // <-- Add FirebaseAuthGuard as global provider
  exports: [FirebaseAdminModule, FirebaseAuthGuard], // <-- Export globally
})
export class AppModule {}
