import {Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {User, Todo, Comment} from '@prisma/client'
import {UpdateUserDto} from "./dto/update-user.dto";


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

    async updateUser(user_id: number, UserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        const user = await this.prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                email: UserDto.email,
                nickname: UserDto.nickname,
            }
        })
        delete user.password
        return user
    }

    async deleteUser(user_id: number): Promise<void> {
        await this.prisma.user.delete({
            where: {
                id: user_id
            }
        })
    }
}
