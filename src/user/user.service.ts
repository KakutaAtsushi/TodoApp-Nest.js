import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {Comment, Todo, User} from '@prisma/client'
import {UpdateUserDto} from "./dto/update-user.dto";
import {DeleteUserDto} from "./dto/delete-user.dto";


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    async getUserList(): Promise<Omit<User[], 'password'>> {
        const userList = []
        const users = await this.prisma.user.findMany();
        await users.forEach(function (user) {
            delete user.password
            userList.push(user)
        })
        return userList
    }

    async findUser(user_id: number): Promise<Omit<User, "password">> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: user_id
            }
        })
        delete user.password
        return user
    }

    async findUserTodoList(user_id: number): Promise<Todo[]> {
        return await this.prisma.todo.findMany({
            where: {
                user_id: user_id
            }
        })
    }

    async findUserCommentList(user_id: number): Promise<Comment[]> {
        return await this.prisma.comment.findMany({
            where: {user_id: user_id}
        })
    }

    async updateUser(dto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        const user_id = Number(dto.id);
        if (!await this.isExistsUser(user_id)) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `Missing user(id: ${user_id}).`,
                },
                404,
            );
        }
        const users = await this.prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                email: dto.email,
                nickname: dto.nickname,
            }
        })
        delete users.password
        return users
    }

    async deleteUser(dto: DeleteUserDto): Promise<void> {
        const user_id = Number(dto.id)
        if (!await this.isExistsUser(user_id)) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `Missing user(id: ${user_id}).`,
                },
                404,
            );
        }
        await this.prisma.user.delete({
            where: {
                id: user_id
            }
        })
    }

    isExistsUser(user_id: number): Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id: user_id
            }
        });
    }
}
