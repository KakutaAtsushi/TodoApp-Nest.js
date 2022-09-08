import {Injectable} from '@nestjs/common';
import {Comment} from '@prisma/client'
import {PrismaService} from "../prisma/prisma.service";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getCommentList(): Promise<Comment[]> {
        return await this.prisma.comment.findMany();
    }

    async findComment(comment_id: number): Promise<Comment> {
        return await this.prisma.comment.findUnique({
            where: {
                id: comment_id
            }
        })
    }

    async createComment(user_id: number, todo_id: number, dto: CreateCommentDto): Promise<Comment> {
        return await this.prisma.comment.create({
            data: {
                user_id: user_id,
                todo_id: todo_id,
                content: dto.content,
            }
        })
    }

    async updateComment(comment_id: number, dto: UpdateCommentDto): Promise<Comment> {
        return await this.prisma.comment.update({
            where: {
                id: comment_id
            },
            data: {
                ...dto
            },
        })
    }

    async deleteComment(comment_id: number): Promise<void> {
        await this.prisma.comment.delete({
            where: {
                id: comment_id
            }
        })
    }
}
