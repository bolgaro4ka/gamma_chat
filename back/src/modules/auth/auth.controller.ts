import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO, LoginUserDTO } from 'src/common/dto/user';
import { JwtGuard } from 'src/guards/jwt.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

    @Post('reg')
    async registerUser(@Body() dto: CreateUserDTO) {
        return this.authService.registerUser(dto);
    }
    @UseGuards(JwtGuard)
    @Get('all')
    async getAllUsers() {
        return this.authService.getAllUsers();
    }

    @Post('login')
    async loginUser(@Body() dto: LoginUserDTO) {
        return this.authService.loginUser(dto);
    }

    @UseGuards(JwtGuard)
    @Get('is_auth')
    async isAuth() {
        return true;
    }

    @UseGuards(JwtGuard)
    @Get('me')
    async me(@Req() req) {
        return await this.userService.getPublicUser(req.user.email);
    }
}
