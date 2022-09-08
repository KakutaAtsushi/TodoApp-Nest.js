import {IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, MinLength} from 'class-validator';

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsOptional()
    @IsString()
    nickname?:string
}