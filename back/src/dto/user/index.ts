import { IsEmail, IsString } from "class-validator";


export class CreateUserDTO {
    @IsEmail()
    email: string;
    @IsString({ message: 'Password must be a string' })
    password: string;
    @IsString({ message: 'Username must be a string' })
    username: string;
    @IsString({ message: 'Name must be a string' })
    first_name: string;
    @IsString({ message: 'Name must be a string' })
    last_name: string;
}

export class LoginUserDTO {
    @IsEmail()
    email: string;
    @IsString()
    password: string;
}