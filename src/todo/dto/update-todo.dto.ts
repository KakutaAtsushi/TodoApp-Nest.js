import {IsDate, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class UpdateTodoDto {

    @IsString()
    title?: string;

    @IsString()
    content?: string;

    @IsString()
    image_url?: string;

    @IsString()
    status?: string;

    todo_due?: Date;
}