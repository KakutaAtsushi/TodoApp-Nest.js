import {IsNotEmpty, IsString} from "class-validator";

export class UpdateCommentDto {

    @IsString()
    content: string;

    @IsNotEmpty()
    comment_id: number;
}