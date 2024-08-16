import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { AppService } from './app.service';
import { Server, Socket } from 'socket.io';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Req, UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://127.0.0.1:5173'],
  }})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly appService: AppService) {}
  @WebSocketServer() server: Server;
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: any, payload: {text: string, createdAt?: Date | string, userId: string, chatId: string}): Promise<void> {
    const msg = await this.appService.createMessage(payload);
    this.server.emit('recMessage', {text: payload.text, createdAt: payload.createdAt, userId: payload.userId, username: msg.username, chatId: payload.chatId});
  }

  afterInit(server: any) {
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    console.log('Disconnected ' + client.id);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('Connected '+client.id);
  }
}
