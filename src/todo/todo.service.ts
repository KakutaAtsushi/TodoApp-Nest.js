import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {Comment, Todo} from '@prisma/client'
import {PrismaService} from "../prisma/prisma.service";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {UpdateTodoDto} from "./dto/update-todo.dto";
import {type} from "os";

@Injectable()
export class TodoService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getTodoList(): Promise<Todo[]> {
        return await this.prisma.todo.findMany();
    }

    async findTodo(todo_id: number): Promise<Todo> {
        const isExists = await this.prisma.todo.findUnique({
            where: {
                id: todo_id
            },
        });
        if (!isExists) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `Missing todo(todo_id: ${todo_id}).`,
                },
                404,
            );
        }
        return isExists
    }

    async findCompletionTodo(): Promise<Todo[]> {
        return await this.prisma.todo.findMany({
            where: {
                is_completed: true,
            },
            include: {
                user: true
            }
        })
    }

    async findInCompleteTodo(): Promise<Todo[]> {
        return await this.prisma.todo.findMany({
            where: {
                is_completed: false,
            },
            include: {
                user: true
            }
        })
    }

    async findTodoComments(todo_id: number): Promise<Comment[]> {
        return await this.prisma.comment.findMany({
            where: {
                todo_id: todo_id
            },
            include: {
                user: true
            }
        })
    }

    async findTodoAssigner(assign_id: number): Promise<Todo[]> {
        return await this.prisma.todo.findMany({
            where: {
                assign_id: assign_id
            },
            include: {
                user: true
            }
        })
    }

    async findTodoOverdue(): Promise<Todo[]> {
        const getCurrentTime = () => {
            let currentTime = new Date();
            return currentTime.toLocaleString()
        }
        return await this.prisma.todo.findMany({
            where: {
                todo_due: {
                    lte: new Date(getCurrentTime())
                }
            },
            include: {
                user: true
            }
        })
    }

    async createTodo(dto: CreateTodoDto): Promise<String | Todo> {
        const user_id = Number(dto.user_id)
        const assign_id = dto.assign_id ? Number(dto.assign_id) : 0;
        if (assign_id) {
            const isExists = await this.prisma.user.findUnique({
                where: {id: assign_id}
            })

            if (!isExists) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Missing user(user_id: ${assign_id}).`,
                    },
                    404,
                );
            }
        }
        if (user_id) {
            const isExists = await this.prisma.user.findUnique({
                where: {id: user_id}
            })
            if (!isExists) {
                throw new HttpException(
                    {
                        status: HttpStatus.NOT_FOUND,
                        error: `Missing user(user_id: ${user_id}).`,
                    },
                    404,
                );
            }

            return await this.prisma.todo.create({
                data: {
                    user_id: user_id,
                    assign_id: assign_id,
                    title: dto.title,
                    content: dto.content,
                    image_url: dto.image_url,
                    todo_due: new Date(dto.todo_due),
                },
            });
        }
    }

    async updateTodo(dto: UpdateTodoDto): Promise<Todo> {
        const sendMail = require('sendmail')();
        dto.assign_id = Number(dto.assign_id);
        dto.is_completed = dto.is_completed;
        Logger.debug(dto);
        const todo_id = Number(dto.todo_id);
        delete dto.todo_id

        let todoDetail = {
            currentTodoDetail: await this.prisma.todo.findUnique({
                where: {
                    id: todo_id,
                },
            }),
            updatedTodoDetail: dto,
        };
        const isExists = await this.prisma.user.findUnique({
            where: {id: dto.assign_id}
        })
        if (!isExists) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `Missing user(assign_id: ${dto.assign_id}).`,
                },
                404,
            );
        }
        const managerNames = {
            currentManagerName: await this.prisma.user.findUnique({
                where: {
                    id: todoDetail.currentTodoDetail.assign_id,
                },
            }),
            updateManagerName: await this.prisma.user.findUnique({
                where: {
                    id: dto.assign_id,
                },
            }),
        };
        const updatedTodo = await this.prisma.todo.update({
            where: {
                id: todo_id
            },
            data: {
                ...dto,
            },
            include: {
                user: true
            },

        })
        await this.sendMail(sendMail, todoDetail, managerNames)
        return updatedTodo;
    }

    async deleteTodo(dto: UpdateTodoDto): Promise<void> {
        const todo_id = Number(dto.todo_id);
        const isExists = await this.prisma.todo.findUnique({
            where: {
                id: todo_id,
            }
        })
        if (!isExists) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `Missing todo(id: ${todo_id}).`,
                },
                404,
            );
        }
        await this.prisma.todo.delete({
            where: {
                id: todo_id
            }
        })
    }

    sendMail(sendMailObj, todoDetail, assignersName): void {
        sendMailObj({
            from: 'kakuta.atsushi0909@gmail.com',
            to: 'invest9me@yahoo.co.jp',
            subject: `タイトル: <${todoDetail.currentTodoDetail.title}>が更新されました`,
            text: `
                タイトル: ${todoDetail.currentTodoDetail.title} → ${todoDetail.updatedTodoDetail.title}
                詳細: ${todoDetail.currentTodoDetail.content} → ${todoDetail.updatedTodoDetail.content}
                担当者: ${assignersName.currentManagerName.nickname ? assignersName.currentManagerName.nickname : "匿名さん"} → ${assignersName.updateManagerName.nickname ? assignersName.updateManagerName.nickname : "匿名さん"}
                `
        }, function (err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
    }

}
