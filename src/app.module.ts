import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {PrismaModule} from './prisma/prisma.module';
import {TodoModule} from './todo/todo.module';
import {ConfigModule} from "@nestjs/config";
import {CommentModule} from './comment/comment.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        AuthModule,
        UserModule,
        PrismaModule,
        TodoModule,
        CommentModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
