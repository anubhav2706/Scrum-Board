import { IUser } from './User';
// import { IComment } from './Comment'; // Uncomment if you have a comment type

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
  // comments?: IComment[]; // Use this if you want comments and have a type
}

export interface CreateTicketDto {
  title: string;
  description: string;
  projectId: string;
  assigneeIds: string[]; // userIds
  status?: TicketStatus;
  priority?: TicketPriority;
  tags?: string[];
  dueDate?: string;
} 