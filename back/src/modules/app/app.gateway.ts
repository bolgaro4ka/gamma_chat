import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

import { AppService } from './app.service';
import { Server, Socket } from 'socket.io';
import { Prisma } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Req, UseGuards } from '@nestjs/common';
import { writeFileSync } from 'fs'; // Импортируем writeFileSync
import { join } from 'path'; // Импортируем join для создания пути
import { Extensions } from '@prisma/client/runtime/library';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5000', 'http://192.168.0.228:5000', 'https://gamma.paia1nik.ru'],
  }})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly appService: AppService) {}
  @WebSocketServer() server: Server;
  private fileChunks = new Map<string, Buffer[]>();
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: any, payload: {text: string, createdAt?: Date | string, userId: string, chatId: string}): Promise<void> {
    const msg = await this.appService.createMessage(payload);
    this.server.emit('recMessage', {text: payload.text, createdAt: payload.createdAt, userId: payload.userId, username: msg.username, chatId: payload.chatId, authorAvatar: msg.authorAvatar});
  }
  @SubscribeMessage('createChat')
  async handleCreateChat(client: any, payload: Prisma.ChatCreateInput & { name: string, userIds: { id: number }[], avatar?: string }) {
    // Сохранить аватарку, если она присутствует
    if (payload.avatar) {
      const avatarPath = this.saveAvatar(payload.avatar, payload.name);
      payload.avatar = avatarPath; // Сохранить путь к аватарке в payload
    }

    const chat = await this.appService.createChat(payload);
    this.server.emit('recChat', chat);
  }

  private saveAvatar(avatarData: string, chatName: string): string {
    const base64Data = avatarData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const date = new Date().getTime();
    const filePath = `./uploads/avatars/${chatName}_${date}.png`; // Пример пути сохранения
    writeFileSync(filePath, buffer);
    return filePath;
  }

  @SubscribeMessage('deleteChat')
  async handleDeleteChat(client: any, payload: number) {
    const chat = await this.appService.deleteChat(payload);
    this.server.emit('delChat', chat);
  }

  @SubscribeMessage('updateChat')
  async handleUpdateChat(client: any, payload: {'name': string, 'chatId': number, 'userIds': { id: number }[], avatar?: string }) {
    // Сохранить аватарку, если она присутствует
    if (payload.avatar) {
      const avatarPath = this.saveAvatar(payload.avatar, payload.name);
      payload.avatar = avatarPath; // Сохранить путь к аватарке в payload
    }

    const chat = await this.appService.updateChat(payload);
    this.server.emit('updChat', chat);
  }

  @SubscribeMessage('updateUser')
  async handleUpdateUser(client: any, payload: { 'username': string, 'userId': number, 'avatar'?: string, 'first_name': string, 'last_name': string }) {
    if (payload.avatar) {
      const avatarPath = this.saveAvatar(payload.avatar, payload.username);
      payload.avatar = avatarPath; // Сохранить путь к аватарке в payload
    }
    const user = await this.appService.updateUser(payload);
    this.server.emit('updUser', user);
  }

  @SubscribeMessage('updateBackgroundImgChat')
  async handleUpdateBackgroundImgChat(
    client: any,
    payload: Prisma.ChatCreateInput & { chatId: number; image: string; name: string; chunkIndex?: number; totalChunks?: number }
  ) {
    const { image, name, chunkIndex, totalChunks, chatId } = payload;

    if (image && chunkIndex !== undefined && totalChunks !== undefined) {
      const fileKey = `${name}_${chatId}`;
      if (!this.fileChunks.has(fileKey)) {
        this.fileChunks.set(fileKey, []);
      }

      const chunkBuffer = Buffer.from(image.split(',')[1], 'base64');
      this.fileChunks.get(fileKey).push(chunkBuffer);

      if (chunkIndex === totalChunks - 1) {
        const avatarPath = this.saveImg(this.fileChunks.get(fileKey), name);
        payload.image = avatarPath; // Сохранить путь к аватарке в payload
        this.fileChunks.delete(fileKey);

        const chat = await this.appService.updateBackgroundImgChat(payload);
        this.server.emit('updImgChat', chat);
      }
    }
  }



  private saveImg(fileChunks: Buffer[], chatName: string): string {
    const buffer = Buffer.concat(fileChunks);
    const date = new Date().getTime();
    const filePath = `./uploads/backgrounds/${chatName}_${date}.png`; // Пример пути сохранения
    writeFileSync(filePath, buffer);
    return filePath;
  }

  private saveFile(fileChunks: Buffer[], chatName: string, ext: string): string {
    const buffer = Buffer.concat(fileChunks);
    const date = new Date().getTime();
    const filePath = `./uploads/files/${chatName}_${date}.${ext}`; // Пример пути сохранения
    writeFileSync(filePath, buffer);
    return filePath;
  }

  @SubscribeMessage('sendMesssageWithFile')
  async handleSendMesssageWithFile(client: any,payload: Prisma.MessageCreateInput & { chatId: string; file: string; name: string; chunkIndex?: number; totalChunks?: number, text: string, createdAt?: Date | string, userId: string, extension: string }) {
    const { file, name, chunkIndex, totalChunks, chatId, text, createdAt, userId, extension } = payload;

    if (file && chunkIndex !== undefined && totalChunks !== undefined) {
      const fileKey = `${name}_${chatId}`;
      if (!this.fileChunks.has(fileKey)) {
        this.fileChunks.set(fileKey, []);
      }

      const chunkBuffer = Buffer.from(file.split(',')[1], 'base64');
      this.fileChunks.get(fileKey).push(chunkBuffer);

      if (chunkIndex === totalChunks - 1) {
        console.log(file.slice(0, 100));
        const avatarPath = this.saveFile(this.fileChunks.get(fileKey), name, extension);
        payload.file = avatarPath; // Сохранить путь к аватарке в payload
        this.fileChunks.delete(fileKey);

        const chat = await this.appService.createMessageWithFile(payload);
        this.server.emit('recMessageWithFile', chat);
      }
    }
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
