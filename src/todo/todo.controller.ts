import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {TodoService} from "./todo.service";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {Comment, Todo} from "@prisma/client";
import {UpdateTodoDto} from "./dto/update-todo.dto";
import {DeleteTodoDto} from "./dto/delete-todo.dto";


@UseGuards(AuthGuard('jwt'))
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {
    }

    @Get("over-due")
    findTodoOverdue(): Promise<Todo[]> {
        return this.todoService.findTodoOverdue();
    }

    @Get("/completion")
    findCompletionTodo() {
        return this.todoService.findCompletionTodo();
    }

    @Get("/incomplete")
    findInCompleteTodo() {
        return this.todoService.findInCompleteTodo();
    }

    @Get()
    getTodoList(): Promise<Todo[]> {
        return this.todoService.getTodoList();
    }

    @Get(':id')
    findTodo(@Param("id", ParseIntPipe) todo_id: number): Promise<Todo> {
        return this.todoService.findTodo(todo_id);
    }

    @Get(":assigner_id/assigners")
    findTodoManager(@Param("assigner_id", ParseIntPipe) assigner_id: number): Promise<Todo[]> {
        return this.todoService.findTodoAssigner(assigner_id);
    }

    @Get(':todo_id/comments')
    findTodoComments(
        @Param('todo_id', ParseIntPipe) todo_id: number): Promise<Comment[]> {
        return this.todoService.findTodoComments(todo_id)
    }

    @Post()
    createTodo(
        @Body() dto: CreateTodoDto): Promise<Todo | String> {
        return this.todoService.createTodo(dto)
    }

    @Patch()
    updateTodo(@Body() dto: UpdateTodoDto): Promise<Todo> {
        return this.todoService.updateTodo(dto);
    }

    @Delete()
    deleteTodo(@Body() dto: DeleteTodoDto): Promise<void> {
        return this.todoService.deleteTodo(dto);
    }
}
