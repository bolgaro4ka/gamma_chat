import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService
  ) {}
  async createMessage(data: {text: string, createdAt?: Date | string, userId: string, chatId: string}) : Promise<Message> {
    const authorId = parseInt(data.userId);
    const chatId = parseInt(data.chatId);
    const user = await this.prisma.user.findUnique({where: {id: authorId}})
    
    return await this.prisma.message.create({
      data: {
        text: data.text,
        chat: {
          connect: {
            id: chatId
          }
        },
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
  async getMessages(chatId : number) : Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        chatId
      }
    })
  }

  async getUserChats(userId: number) {
    const userWithChats = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        chats: {
          include: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
  
    if (userWithChats) {
      // Преобразовать результат, чтобы вернуть только id пользователей в каждом чате
      const chatsWithUserIds = userWithChats.chats.map(chat => ({
        id: chat.id,
        name: chat.name,
        userIds: chat.users.map(user => user.id),
        // Включите другие необходимые поля чата, исключая поле users
        // например, createdAt и updatedAt
      }));
  
      return chatsWithUserIds;
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async createChat(data: Prisma.ChatCreateInput & { userIds: { id: number }[] }, userId: number) {
    const usersToConnect = [{ id: userId }, ...data.userIds];

    usersToConnect.forEach(user => {
      if (typeof user.id !== 'number' || isNaN(user.id)) {
        throw new Error(`Некорректный ID пользователя: ${user.id}`);
      }
    });
  
    const chat = await this.prisma.chat.create({
      data: {
        name: data.name,
        users: {
          connect: usersToConnect,
        },
      },
    });
  
    return chat;
  }
  getHello(): string {
    return 'Hello World!';
  }

  async deleteChat(chatId: number) {
    return await this.prisma.chat.delete({
      where: {
        id: chatId
      }
    })
  }
}
 