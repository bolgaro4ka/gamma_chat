import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from 'src/common/dto/user';
import { AppErrors } from 'src/common/errors';
import * as bcrypt from 'bcrypt';
import { APP_USER_FIELDS, USER_SELECT_FIELDS } from 'src/common/consts';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    public async createUser(dto: CreateUserDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        })

        if (user) return new BadRequestException(AppErrors.USER_FOUND)

        dto.password = await this.hashPassword(dto.password)

        return this.prismaService.user.create({
            data: {
                email: dto.email,
                first_name: dto.first_name,
                last_name: dto.last_name,
                username: dto.username,
                password: dto.password
            },
            select: {
                ...USER_SELECT_FIELDS
            }
        })

        
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    public async getAllUsers () {
        return this.prismaService.user.findMany({ select: {...USER_SELECT_FIELDS}})
    }

    public async getPublicUser(email:string) {
        return this.prismaService.user.findUnique({ where: { email }, select: {...USER_SELECT_FIELDS}})
    }

    public async getUserByEmail(email:string) {
        return this.prismaService.user.findUnique({ where: { email }, select: {...APP_USER_FIELDS}})
    }

    public async getUserById(id:number) {
        return this.prismaService.user.findUnique({ where: { id }, select: {...APP_USER_FIELDS}})
    }
}
