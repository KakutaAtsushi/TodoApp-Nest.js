import {IsEmail, IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsString()
    nickname?:string
}