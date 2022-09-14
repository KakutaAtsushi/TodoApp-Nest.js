import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateTodoDto {

    @IsNotEmpty()
    todo_id: number;

    @IsString()
    title?: string;

    @IsString()
    content?: string;

    @IsString()
    image_url?: string;

    is_completed: boolean;

    @IsOptional()
    assign_id?: number

    todo_due?: Date;
}