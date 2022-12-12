import { Module, Logger } from '@nestjs/common';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { TagsService } from '../tags/tags.service';

@Module({
  providers: [PrismaClientService, Logger, TagsService],
})
export class AccountModule {}
