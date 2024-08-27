import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WsService } from './ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WsGateway {

  @WebSocketServer() wss: Server;
  constructor(private readonly wsService: WsService) { }



  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload) {
    this.wss.emit('message-from-server', {
      id: client.id,
      message: payload.message || 'no-message!!',
    });

  }
}
