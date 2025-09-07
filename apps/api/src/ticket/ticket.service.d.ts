import { Model } from 'mongoose';
import { Ticket } from './ticket.schema';
import { IUser } from '../../../../packages/types/index';
import { CreateTicketDto } from './ticket.dto';
export declare class TicketService {
    private ticketModel;
    constructor(ticketModel: Model<Ticket>);
    findAllByProject(projectId: string): Promise<Ticket[]>;
    createTicket(dto: CreateTicketDto, user: IUser): Promise<Ticket>;
}
