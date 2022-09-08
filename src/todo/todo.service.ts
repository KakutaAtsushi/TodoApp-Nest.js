import {Injectable} from '@nestjs/common';
import {Todo, Comment} from '@prisma/client'
import {PrismaService} from "../prisma/prisma.service";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {UpdateTodoDto} from "./dto/update-todo.dto";

@Injectable()
export class TodoService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getTodoList(): Promise<Todo[]> {
        return await this.prisma.todo.findMany();
    }

    async findTodo(todo_id: number): Promise<Todo> {
        return await this.prisma.todo.findUnique({
            where: {
                id: todo_id
            },
        });
    }

    async findTodoComments(todo_id: number): Promise<Comment[]> {
        return await this.prisma.comment.findMany({
            where: {
                todo_id: todo_id
            }
        })
    }

    async createTodo(user_id: number, dto: CreateTodoDto): Promise<Todo> {
        return await this.prisma.todo.create({
            data: {
                user_id: user_id,
                title: dto.title,
                content: dto.content,
                image_url: dto.image_url,
                todo_due: new Date(dto.todo_due),
                status: dto.status,
            },
        });
    }

    async updateTodo(todo_id: number, dto: UpdateTodoDto): Promise<Todo> {
        return await this.prisma.todo.update({
            where: {
                id: todo_id
            },
            data: {
                ...dto
            },
        })

    }

    async deleteTodo(todo_id: number): Promise<void> {
        await this.prisma.todo.delete({
            where: {
                id: todo_id
            }
        })
    }

}
