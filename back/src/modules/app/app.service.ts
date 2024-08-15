import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  async createMessage(data: {text: string, createdAt?: Date | string, userId: string}) : Promise<Message> {
    const authorId = parseInt(data.userId);
    const user = await this.prisma.user.findUnique({where: {id: authorId}})
    
    return await this.prisma.message.create({
      data: {
        text: data.text,
        createdAt: data.createdAt,
        username: user.username,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    })
  }
  async getMessages() : Promise<Message[]> {
    return await this.prisma.message.findMany()
  }
  getHello(): string {
    return 'Hello World!';
  }
}
 