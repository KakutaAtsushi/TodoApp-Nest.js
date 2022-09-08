import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {TodoService} from "./todo.service";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {Todo, Comment} from "@prisma/client";
import {UpdateTodoDto} from "./dto/update-todo.dto";


@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    getTodoList(): Promise<Todo[]> {
        return this.todoService.getTodoList();
    }

    @Get(':id')
    findTodo(@Param("id", ParseIntPipe) todo_id: number): Promise<Todo> {
        return this.todoService.findTodo(todo_id);
    }

    @Get(':todo_id/comments')
    findTodoComments(
        @Param('todo_id', ParseIntPipe) todo_id: number): Promise<Comment[]> {
        return this.todoService.findTodoComments(todo_id)
    }

    @Post(":id")
    createTodo(
        @Body() dto: CreateTodoDto,
        @Param("id", ParseIntPipe) user_id: number): Promise<Todo> {
        return this.todoService.createTodo(user_id, dto)
    }

    @Patch(':id')
    updateTodo(
        @Body() dto: UpdateTodoDto,
        @Param("id", ParseIntPipe) todo_id: number): Promise<Todo> {
        return this.todoService.updateTodo(todo_id, dto);
    }

    @Delete(':id')
    deleteTodo(
        @Param("id", ParseIntPipe) todo_id: number): Promise<void> {
        return this.todoService.deleteTodo(todo_id);
    }
}
