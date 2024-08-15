import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Message } from '@prisma/client';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtGuard)
  @Get('/api/chat')
  async getMessages(@Res() res){
    const messages = await this.appService.getMessages();
    res.json( messages );
  }
}
