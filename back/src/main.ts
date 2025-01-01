import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ['http://localhost:4004', 'http://192.168.0.228:4004', 'https://gamma.blgr.space'], credentials: true });
  // Используем middleware cookie-parser
  app.use(cookieParser());

  // Настраиваем middleware csurf
  
  
  await app.listen(8004);


}
bootstrap();
