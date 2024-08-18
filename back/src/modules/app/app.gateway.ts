import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { AppService } from './app.service';
import { Server, Socket } from 'socket.io';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Req, UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5000', 'http://192.168.0.228:5000'],
  }})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly appService: AppService) {}
  @WebSocketServer() server: Server;
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: any, payload: {text: string, createdAt?: Date | string, userId: string, chatId: string}): Promise<void> {
    const msg = await this.appService.createMessage(payload);
    this.server.emit('recMessage', {text: payload.text, createdAt: payload.createdAt, userId: payload.userId, username: msg.username, chatId: payload.chatId});
  }
  @SubscribeMessage('createChat')
  async handleCreateChat(client: any, payload: Prisma.ChatCreateInput & { name: string, userIds: { id: number }[] }) {
    const chat = await this.appService.createChat(payload);
    this.server.emit('recChat', chat);
  }

  @SubscribeMessage('deleteChat')
  async handleDeleteChat(client: any, payload: number) {
    const chat = await this.appService.deleteChat(payload);
    this.server.emit('delChat', chat);
  }

  @SubscribeMessage('updateChat')
  async handleUpdateChat(client: any, payload: {'name': string, 'chatId': number, 'userIds': { id: number }[]}) {
    const chat = await this.appService.updateChat(payload);
    this.server.emit('updChat', chat);
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
