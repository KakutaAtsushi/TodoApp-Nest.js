import {IsNotEmpty, IsNumber} from "class-validator";

export class DeleteTodoDto {
    @IsNotEmpty()
    todo_id: number
}