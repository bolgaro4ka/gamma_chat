import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';

@Module({
  providers: [TokenService],
  exports: [TokenService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user', session: false }), JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: ConfigService.get<string>('JWT_EXPIRATION_TIME')
        }
      }),
      inject: [ConfigService],
      
    })
  ]
})
export class TokenModule {}
