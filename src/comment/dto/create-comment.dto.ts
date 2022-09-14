import {IsNotEmpty, IsString} from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    content?: string;

    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    todo_id: number;
}