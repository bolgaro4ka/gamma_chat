import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppGateway } from './app.gateway';
import { TokenModule } from '../token/token.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import config from 'src/config';

@Module({
  imports: [TokenModule, AuthModule, UsersModule, ConfigModule.forRoot({ isGlobal: true, load: [config] }), ],
  controllers: [AppController],
  providers: [AppService, PrismaService, AppGateway],
})
export class AppModule {}