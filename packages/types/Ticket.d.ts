import { IUser } from './User';
export type TicketStatus = 'todo' | 'in-progress' | 'done';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export interface ITicket {
    id: string;
    title: string;
    description: string;
    projectId: string;
    assignees: IUser[];
    status: TicketStatus;
    priority: TicketPriority;
    tags: string[];
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}
