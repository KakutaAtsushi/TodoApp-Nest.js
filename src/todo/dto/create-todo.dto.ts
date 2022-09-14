import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateTodoDto {

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    title: string;

    content?: string;

    image_url?: string;

    @IsOptional()
    assign_id?: number;

    @IsNotEmpty()
    todo_due: Date;

    is_completed: boolean;

}