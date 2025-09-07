import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, ITicket, IComment } from '../../../../packages/types/index';
export declare class TicketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server<ClientToServerEvents, ServerToClientEvents>;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleTicketUpdate(ticket: ITicket): void;
    handleTicketComment(comment: IComment): void;
    handleChatMessage(data: {
        roomId: string;
        message: string;
    }): void;
    handleUserTyping(data: {
        roomId: string;
        userId: string;
    }): void;
}
