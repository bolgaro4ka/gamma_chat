import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDTO, LoginUserDTO } from 'src/common/dto/user';
import { TokenService } from '../token/token.service';
import { AppErrors } from 'src/common/errors';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
        private readonly tokenService: TokenService
    ) {}

    public async registerUser(dto: CreateUserDTO) {
        const newUser = await this.userService.createUser(dto);

        const payload = {
            email: dto.email,
            username: dto.username
        }

        const token = await this.tokenService.genJWTToken(payload);


        return {...newUser, token}
    }

    public async loginUser(dto: LoginUserDTO) {
        const user = await this.userService.getUserByEmail(dto.email);

        if (!user) return new BadRequestException(AppErrors.USER_NOT_FOUND);

        const checkPassword = await bcrypt.compare(dto.password, user.password);

        if (!checkPassword) return new BadRequestException(AppErrors.INVALID_PASSWORD);

        delete user.password


        const payload = {
            email: dto.email,
            id : user.id,
            username: user.username
        }

        const token = await this.tokenService.genJWTToken(payload);

        return {...user, token}
    }

    public async getAllUsers() {
        return this.userService.getAllUsers();
    }
}
