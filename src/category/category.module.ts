import { Module, Logger } from '@nestjs/common';
import { CategoryResolver } from './category.resolvers';
import { CategoryService } from './category.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [
    Logger,
    CategoryResolver,
    CategoryService,
    PrismaClientService,
    UserService,
  ],
})
export class CategoryModule {}
