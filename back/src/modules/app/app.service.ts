import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Message, Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService
  ) {}
  async createMessage(data: {text: string, createdAt?: Date | string, userId: string, chatId: string}) : Promise<Message & {authorAvatar: string}> {
    const authorId = parseInt(data.userId);
    const chatId = parseInt(data.chatId);
    const user = await this.prisma.user.findUnique({where: {id: authorId}})

    console.log('Msg from: ', user.username);
    
    const message = await this.prisma.message.create({
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
    });
  
    // Дополнительный запрос для получения аватара автора
    const author = await this.prisma.user.findUnique({
      where: {
        id: authorId
      },
      select: {
        avatar: true
      }
    });
  
    return {
      ...message,
      authorAvatar: author.avatar
    };
  }

  async updateUser(data: { 'username': string, 'userId': number, 'avatar'?: string, 'first_name': string, 'last_name': string }) : Promise<any> {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        id: data.userId
      }
    })
    
    
    
    return await this.prisma.user.update({
      where: {
        id: data.userId
      },
      data: {
        username: data.username,
        avatar: data?.avatar || oldUser.avatar,
        first_name: data.first_name,
        last_name: data.last_name
      }
    })
  }
  async getMessages(chatId : number) : Promise<Message[]> {
    return await this.prisma.message.findMany({
      where: {
        chatId
      },
      include: {
        author: {
          select: {
            avatar: true
          }
        }
      }
    })
  }

  async getChat(chatId) {
    return await this.prisma.chat.findUnique({
      where: {
        id: chatId
      },
      include: {
        messages: true,
        users: true
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
        avatar: chat.avatar,
        // Включите другие необходимые поля чата, исключая поле users
        // например, createdAt и updatedAt
      }));
  
      return chatsWithUserIds;
    } else {
      throw new Error(`User with ID ${userId} not found.`);
    }
  }

  async createChat(data: Prisma.ChatCreateInput & { userIds: { id: number }[] }) {
    console.log(data);
    const usersToConnect = [...data.userIds];

    usersToConnect.forEach(user => {
      if (typeof user.id !== 'number' || isNaN(user.id)) {
        throw new Error(`Некорректный ID пользователя: ${user.id}`);
      }
    });
  
    const chat = await this.prisma.chat.create({
      data: {
        name: data.name,
        avatar: data.avatar,
        users: {
          connect: usersToConnect,
        },
      },
    });

    const chatId = chat.id;

    const GChat = await this.prisma.chat.findUnique({
      where: {
        id: chatId
      },
      include: {
        users: {
          select: {
            id: true,
            avatar: true
          }
        }
      }
      
    }) 

    const result = {
      id: GChat.id,
      name: GChat.name,
      userIds: GChat.users.map((user) => user.id),
      avatar: GChat.avatar
      // Добавьте другие необходимые поля, если нужно
    };

    return result;
  }
  getHello(): string {
    return 'Hello World!';
  }

  async deleteChat(chatId: number) {
    // Check if the chat exists
    const chatExists = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });
  
    if (!chatExists) {
      console.error(`Chat with id ${chatId} does not exist.`);
      throw new Error(`Chat with id ${chatId} does not exist.`);
    }
  
    console.log(`Chat with id ${chatId} exists. Proceeding to delete messages.`);
  
    // First, delete all messages associated with the chat
    const deletedMessages = await this.prisma.message.deleteMany({
      where: {
        chatId: chatId,
      },
    });
  
    console.log(`Deleted ${deletedMessages.count} messages associated with the chat.`);
  
    // Then, delete the chat
    const deletedChat = await this.prisma.chat.delete({
      where: {
        id: chatId,
      },
    });
  
    console.log(`Deleted chat with id ${chatId}.`);
  
    return deletedChat;
  }

  async updateChat(data: { 'name': string, 'chatId': number, 'userIds': { id: number }[], avatar?: string }) {
    const oldChat = await this.prisma.chat.findUnique({
        where: {
            id: Number(data.chatId)
        },
        include: {
            messages: true,
            users: true
        }
    });

    const newUserIds = data.userIds.map(userId => userId.id);
    const oldUserIds = oldChat.users.map(user => user.id);

    const usersToConnect = newUserIds.filter(id => !oldUserIds.includes(id)).map(id => ({ id }));
    const usersToDisconnect = oldUserIds.filter(id => !newUserIds.includes(id)).map(id => ({ id }));

    const chat = await this.prisma.chat.update({
        where: {
            id: data.chatId
        },
        include: {
            messages: true,
            users: true
        },
        data: {
            name: data.name,
            avatar: data.avatar,
            users: {
                connect: usersToConnect,
                disconnect: usersToDisconnect
            },
            messages: {
                connect: oldChat.messages.map(message => ({
                    id: message.id
                }))
            }
        }
    });

    return {
        id: chat.id,
        name: chat.name,
        userIds: chat.users.map(user => user.id),
        avatar: chat.avatar,
    };
}
}
 