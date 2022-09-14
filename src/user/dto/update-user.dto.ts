import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    id: number;

    @IsOptional()
    @IsString()
    nickname?: string
}