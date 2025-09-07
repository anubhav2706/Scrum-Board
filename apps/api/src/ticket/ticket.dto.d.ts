import { TicketStatus, TicketPriority } from '../../../../packages/types/index';
export declare class CreateTicketDto {
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
    assigneeIds: string[];
    projectId: string;
    dueDate?: string;
}
