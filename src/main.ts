import { NestFactory } from '@nestjs/core';
import { json } from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['verbose'],
  });
  app.enableCors();
  app.use(json({ limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();
