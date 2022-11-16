import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';


async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ['verbose']
    });
    await app.listen(3000);
}
bootstrap();
