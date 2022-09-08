import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {UserService} from "./user.service";
import {Todo, Comment, User} from "@prisma/client";
import {UpdateUserDto} from "./dto/update-user.dto";


@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    getUserLists(): Promise<Omit<User[], 'password'>> {
        return this.userService.getUserList();
    }

    @Get(':user_id')
    findUser(@Param("user_id", ParseIntPipe) user_id: number): Promise<Omit<User, 'password'>> {
        return this.userService.findUser(user_id);
    }

    @Get(':user_id/todo')
    findUserTodoList(@Param("user_id", ParseIntPipe) user_id: number): Promise<Todo[]> {
        return this.userService.findUserTodoList(user_id);
    }

    @Get(':user_id/comment')
    findUserCommentList(@Param('user_id', ParseIntPipe) user_id: number): Promise<Comment[]> {
        return this.userService.findUserCommentList(user_id);
    }

    @Patch(':user_id')
    updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param("user_id", ParseIntPipe) user_id: number): Promise<UpdateUserDto> {
        return this.userService.updateUser(user_id, updateUserDto);
    }

    @Delete(':user_id')
    deletedUser(
        @Param("user_id", ParseIntPipe) user_id: number): Promise<void> {
        return this.userService.deleteUser(user_id);
    }
}
