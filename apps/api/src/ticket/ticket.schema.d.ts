import { Document } from 'mongoose';
import { TicketStatus, TicketPriority } from '../../../../packages/types/index';
export declare class Ticket extends Document {
    title: string;
    description: string;
    projectId: string;
    assignees: string[];
    status: TicketStatus;
    priority: TicketPriority;
    tags: string[];
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}
export declare const TicketSchema: import("mongoose").Schema<Ticket, import("mongoose").Model<Ticket, any, any, any, Document<unknown, any, Ticket, any> & Ticket & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Ticket, Document<unknown, {}, import("mongoose").FlatRecord<Ticket>, {}> & import("mongoose").FlatRecord<Ticket> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
