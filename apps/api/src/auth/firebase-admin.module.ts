// apps/api/src/auth/firebase-admin.module.ts
import { Module, Global } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebase-admin.provider';

@Global()
@Module({
  providers: [FirebaseAdminProvider],
  exports: [FirebaseAdminProvider], // <== important!
})
export class FirebaseAdminModule {}
