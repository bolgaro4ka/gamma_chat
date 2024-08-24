import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ origin: ['http://localhost:5000', 'http://192.168.0.228:5000'], credentials: true });
  // Используем middleware cookie-parser
  app.use(cookieParser());

  // Настраиваем middleware csurf
  
  
  await app.listen(3000);


}
bootstrap();
