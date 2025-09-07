import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db-name';
console.log('📌 Loaded Mongo URI:', JSON.stringify(mongoUri)); // wrapped in JSON.stringify for hidden characters

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/your-db-name')],
  exports: [MongooseModule],
})
export class DatabaseModule {}
