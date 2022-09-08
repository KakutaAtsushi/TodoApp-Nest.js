import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateTodoDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsString()
    content?: string;

    @IsString()
    image_url?: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    todo_due: Date;
}