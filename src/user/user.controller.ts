import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";
import {UserService} from "./user.service";
import {Comment, Todo, User} from "@prisma/client";
import {UpdateUserDto} from "./dto/update-user.dto";
import {DeleteUserDto} from "./dto/delete-user.dto";


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

    @Get(':user_id/todos')
    findUserTodoList(@Param("user_id", ParseIntPipe) user_id: number): Promise<Todo[]> {
        return this.userService.findUserTodoList(user_id);
    }

    @Get(':user_id/comments')
    findUserCommentList(@Param('user_id', ParseIntPipe) user_id: number): Promise<Comment[]> {
        return this.userService.findUserCommentList(user_id);
    }

    @Patch()
    updateUser(
        @Body() dto: UpdateUserDto): Promise<UpdateUserDto> {
        return this.userService.updateUser(dto);
    }

    @Delete()
    deletedUser(@Body() dto: DeleteUserDto): Promise<void> {
        return this.userService.deleteUser(dto);
    }
}
