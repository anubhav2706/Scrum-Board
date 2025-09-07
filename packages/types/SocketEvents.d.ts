import { ITicket } from './Ticket';
import { IComment } from './Comment';
export type ClientToServerEvents = {
    'ticket:update': (ticket: ITicket) => void;
    'ticket:comment': (comment: IComment) => void;
    'chat:message': (data: {
        roomId: string;
        message: string;
    }) => void;
    'user:typing': (data: {
        roomId: string;
        userId: string;
    }) => void;
};
export type ServerToClientEvents = {
    'ticket:updated': (ticket: ITicket) => void;
    'comment:added': (comment: IComment) => void;
    'chat:message': (data: {
        roomId: string;
        message: string;
    }) => void;
    'user:typing': (data: {
        roomId: string;
        userId: string;
    }) => void;
};
