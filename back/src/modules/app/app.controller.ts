import { Body, Controller, Get, Post, Req, Res, UseGuards, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UsersService } from '../users/users.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly userService: UsersService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtGuard)
  @Get('/api/chat/:id')
  async getMessages(@Res() res, @Param('id') chatId: string) {
    const messages = await this.appService.getMessages(parseInt(chatId));
    res.json( messages );
  }

  @UseGuards(JwtGuard)
  @Delete('/api/chat/:id')
  async deleteChat(@Res() res, @Param('id') chatId: string) {
    const chat = await this.appService.deleteChat(parseInt(chatId));
    res.json( chat );
  }

  @UseGuards(JwtGuard)
  @Get('/api/my/chats')
  async getUserChats(@Res() res, @Req() req){
    const user = await this.userService.getUserByEmail(req.user?.email);

    const userId = user?.id;
    const chats = await this.appService.getUserChats(userId);
    res.json( chats );
  }

  @UseGuards(JwtGuard)
  @Post('/api/send/message')
  async sendMessage(@Res() res, @Req() req, @Body() dto : {text: string, createdAt?: Date | string, userId: string, chatId: string}) {
    const msg = await this.appService.createMessage(dto);
    res.json( msg );
  }

  @UseGuards(JwtGuard)
  @Post('/api/create/chat')
  async createChat(@Res() res, @Req() req, @Body() dto : { name: string, users: { id: number }[] }) {
    const user = await this.userService.getUserByEmail(req.user?.email);

    const userId = user?.id;

    console.log('req.user:', req.user);
    if (!userId) {
      throw new Error('userId не найден в req.user');
    }

    const chat = await this.appService.createChat({ name: dto.name, userIds: dto.users }, userId);
    // const newChat = await createChat({ name: 'New Chat', userIds: [{ id: 2 }, { id: 3 }] }, 1);

    res.json( chat );
  }
}
