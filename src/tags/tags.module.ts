import { Module, Logger } from '@nestjs/common';

import { TagsResolver } from './tags.resolver';
import { TagsService } from './tags.service';
import { TagGroupResolver } from './tags.group.resolver';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

@Module({
  providers: [
    Logger,
    PrismaClientService,
    TagsResolver,
    TagsService,
    TagGroupResolver,
  ],
})
export class TagsModule {}
