import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Comment } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { DeleteCommentDto } from "./dto/delete-comment.dto";

@Injectable()
export class CommentService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getCommentList(): Promise<Comment[]> {
        return await this.prisma.comment.findMany();
    }

    async findComment(comment_id: number): Promise<Comment> {
        if (!await this.isExistsComment(comment_id)) {
            throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: `Missing comment(id: ${comment_id}).`
              },
              404
            );
        }

        return await this.prisma.comment.findUnique({
            where: {
                id: comment_id
            },
            include: {
                todo: true
            }
        });
    }

    async createComment(dto: CreateCommentDto): Promise<Comment> {
        const user_id = Number(dto.user_id);
        const todo_id = Number(dto.todo_id);
        const isUserExists = await this.prisma.user.findUnique({
            where: {
                id: user_id
            }
        });
        const isTodoExists = await this.prisma.todo.findUnique({
            where: {
                id: todo_id
            }
        });
        if (!isUserExists) {
            throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: `Missing user(id: ${user_id}).`
              },
              404
            );
        }

        if (!isTodoExists) {
            throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: `Missing todo(id: ${todo_id}).`
              },
              404
            );
        }

        return await this.prisma.comment.create({
            data: {
                user_id: user_id,
                todo_id: todo_id,
                content: dto.content
            }
        });
    }

    async updateComment(dto: UpdateCommentDto): Promise<Comment> {
        const comment_id = Number(dto.comment_id);
        delete dto.comment_id;
        if (!this.isExistsComment(comment_id)) {
            throw new HttpException(
              {
                  status: HttpStatus.NOT_FOUND,
                  error: `Missing comment(id: ${comment_id}).`
              },
              404
            );
        }
        return await this.prisma.comment.update({
            where: {
                id: comment_id
            },
            data: {
                ...dto
            }
        });
    }

    async deleteComment(dto: DeleteCommentDto): Promise<void> {
        const comment_id = Number(dto.comment_id);
        if (!await this.isExistsComment(comment_id)) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `Missing comment(id: ${comment_id}).`,
                },
                404,
            );
        }
        await this.prisma.comment.delete({
            where: {
                id: comment_id
            }
        })
    }

    isExistsComment(comment_id: number) {
        return this.prisma.comment.findUnique({
            where: {
                id: comment_id,
            },
        });
    }
}
