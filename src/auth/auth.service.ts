import {Injectable, ForbiddenException} from '@nestjs/common';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import {Msg, Jwt} from './interfaces/auth.interface'


@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
        private readonly jwt: JwtService
    ) {
    }

    async signUp(dto: AuthDto): Promise<Msg> {
        const hashed: string = await bcrypt.hash(dto.password, 12);
        try {
            await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashed,
                    nickname: dto.nickname
                },
            });
            return {
                message: 'ok',
            };
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('This email is already taken');
                }
            }
            throw error;
        }
    }
    async login(dto: AuthDto): Promise<Jwt>{
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if(!user) throw new ForbiddenException('Email or password incorrect');
        const isValid = await bcrypt.compare(dto.password, user.password);
        if(!isValid) throw new ForbiddenException('Email or password incorrect');
        return this.generateJwt(user.id, user.email)
    }

    async generateJwt(user_id: number, email:string): Promise<Jwt> {
        const payload = {
            sub: user_id,
            email,
        }
        const secret: string = this.config.get('JWT_SECRET');
        const token: string = await this.jwt.signAsync(payload, {
            expiresIn: '5m',
            secret: secret,
        });
        return {accessToken: token}
    }
}
