import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ProjectModule } from '../project/project.module';
import { TicketModule } from '../ticket/ticket.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ProjectModule, TicketModule, UserModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {} 