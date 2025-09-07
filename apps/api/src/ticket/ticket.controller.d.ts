import { TicketService } from './ticket.service';
import { CreateTicketDto } from './ticket.dto';
import { Request } from 'express';
import { IUser } from '../../../../packages/types/index';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    getTickets(projectId: string): Promise<import("./ticket.schema").Ticket[]>;
    createTicket(dto: CreateTicketDto, req: Request & {
        user?: IUser;
    }): Promise<import("./ticket.schema").Ticket>;
}
