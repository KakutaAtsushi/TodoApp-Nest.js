import {Module} from '@nestjs/common';
import {TodoController} from './todo.controller';
import {TodoService} from './todo.service';
import {PrismaModule} from "../prisma/prisma.module";
import {UserModule} from "../user/user.module";

@Module({
    imports: [PrismaModule, UserModule],
    controllers: [TodoController],
    providers: [TodoService]
})
export class TodoModule {
}
