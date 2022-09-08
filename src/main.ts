import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //whitelist のtrueはdtoに含まれないパラメーターを弾く
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.enableCors({
    credentials: true,
  })
  app.use(cookieParser())
  await app.listen(3000);
}
bootstrap();
