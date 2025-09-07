import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents, ITicket, IComment } from '../../../../packages/types/index';

@WebSocketGateway({ cors: true })
export class TicketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents>;

  handleConnection(client: Socket) {
    // Optionally authenticate here
  }

  handleDisconnect(client: Socket) {
    // Cleanup if needed
  }

  @SubscribeMessage('ticket:update')
  handleTicketUpdate(@MessageBody() ticket: ITicket) {
    this.server.emit('ticket:updated', ticket);
  }

  @SubscribeMessage('ticket:comment')
  handleTicketComment(@MessageBody() comment: IComment) {
    this.server.emit('comment:added', comment);
  }

  @SubscribeMessage('chat:message')
  handleChatMessage(@MessageBody() data: { roomId: string; message: string }) {
    this.server.to(data.roomId).emit('chat:message', data);
  }

  @SubscribeMessage('user:typing')
  handleUserTyping(@MessageBody() data: { roomId: string; userId: string }) {
    this.server.to(data.roomId).emit('user:typing', data);
  }
} 