import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {CreateCommentDto} from "./dto/create-comment.dto";
import {CommentService} from "./comment.service";
import {UpdateCommentDto} from "./dto/update-comment.dto";
import {Comment} from '@prisma/client'
import {DeleteCommentDto} from "./dto/delete-comment.dto";
import {AuthGuard} from "@nestjs/passport";

@UseGuards(AuthGuard("jwt"))
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

    @Post()
    createComment(
        @Body() dto: CreateCommentDto): Promise<CreateCommentDto> {
        return this.CommentService.createComment(dto)
    }

    @Patch()
    updateComment(
        @Body() dto: UpdateCommentDto): Promise<Comment> {
        return this.CommentService.updateComment(dto)
    }

    @Delete()
    deleteComment(@Body() dto: DeleteCommentDto): Promise<void> {
        return this.CommentService.deleteComment(dto)
    }
}