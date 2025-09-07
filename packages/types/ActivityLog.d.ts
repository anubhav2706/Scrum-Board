import { IUser } from './User';
export interface IActivityLog {
    id: string;
    type: 'ticket_created' | 'ticket_updated' | 'comment_added';
    user: IUser;
    ticketId?: string;
    projectId?: string;
    timestamp: string;
    metadata?: Record<string, any>;
}
