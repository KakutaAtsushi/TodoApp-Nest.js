import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {CreateCommentDto} from "./dto/create-comment.dto";
import {CommentService} from "./comment.service";
import {UpdateCommentDto} from "./dto/update-comment.dto";
import {Comment} from '@prisma/client'


@Controller('comments')
export class CommentController {
    constructor(private readonly CommentService: CommentService) {
    }

    @Get()
    getCommentList(): Promise<Comment[]> {
        return this.CommentService.getCommentList();
    }

    @Get(":id")
    findComment(@Param('id', ParseIntPipe) comment_id: number): Promise<Comment> {
        return this.CommentService.findComment(comment_id);
    }

    @Post(":user_id/:todo_id")
    createComment(
        @Body() dto: CreateCommentDto,
        @Param('user_id', ParseIntPipe) user_id: number,
        @Param("todo_id", ParseIntPipe) todo_id: number,): Promise<CreateCommentDto> {
        return this.CommentService.createComment(user_id, todo_id, dto)
    }

    @Patch(":id")
    updateComment(
        @Body() dto: UpdateCommentDto,
        @Param('id', ParseIntPipe) comment_id: number): Promise<UpdateCommentDto> {
        return this.CommentService.updateComment(comment_id, dto)
    }

    @Delete(":id")
    deleteComment(
        @Param('id', ParseIntPipe) comment_id: number): Promise<void> {
        return this.CommentService.deleteComment(comment_id)
    }
}