import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CreateTicketDto } from './ticket.dto';

@Controller('tickets')
@UseGuards(FirebaseAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getAllTickets() {
    return this.ticketService.findAll();
  }

  @Get('project/:projectId')
  async getTicketsByProject(@Param('projectId') projectId: string) {
    return this.ticketService.findByProject(projectId);
  }

  @Post()
  async createTicket(@Body() dto: CreateTicketDto, @Request() req: any) {
    return this.ticketService.create({
      ...dto,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
    });
  }

  @Put(':id')
  async updateTicket(@Param('id') id: string, @Body() updateDto: any) {
    return this.ticketService.update(id, {
      ...updateDto,
      updatedAt: new Date().toISOString(),
    });
  }
} 