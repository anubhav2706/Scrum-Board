import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket } from './ticket.schema';
import { ITicket } from '../../../../packages/types/index';
import { UserService } from '../user/user.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
    private readonly userService: UserService,
  ) {}

  private async populateAssignees(ticket: any): Promise<ITicket> {
    const users = await this.userService.findAll();
    const userMap = new Map(users.map(user => [user.id, user]));
    
    const populatedAssignees = (ticket.assignees || []).map((assigneeId: string) => 
      userMap.get(assigneeId) || { id: assigneeId, name: 'Unknown User', email: 'unknown@example.com' }
    );

    return {
      ...ticket,
      id: ticket._id?.toString() || ticket.id,
      assignees: populatedAssignees,
    };
  }

  async findAll(): Promise<ITicket[]> {
    const tickets = await this.ticketModel.find().lean();
    return Promise.all(tickets.map(ticket => this.populateAssignees(ticket)));
  }

  async findByProject(projectId: string): Promise<ITicket[]> {
    const tickets = await this.ticketModel.find({ projectId }).lean();
    return Promise.all(tickets.map(ticket => this.populateAssignees(ticket)));
  }

  async create(createTicketDto: any): Promise<ITicket> {
    const ticket = new this.ticketModel(createTicketDto);
    const savedTicket = await ticket.save();
    return this.populateAssignees(savedTicket.toObject());
  }

  async update(id: string, updateTicketDto: any): Promise<ITicket> {
    const updatedTicket = await this.ticketModel.findByIdAndUpdate(id, updateTicketDto, { new: true }).lean();
    if (!updatedTicket) {
      throw new Error('Ticket not found');
    }
    return this.populateAssignees(updatedTicket);
  }

  async searchTickets(searchRegex: RegExp): Promise<ITicket[]> {
    const tickets = await this.ticketModel.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    }).limit(10).lean();
    
    return Promise.all(tickets.map(ticket => this.populateAssignees(ticket)));
  }
} 