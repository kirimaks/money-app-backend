import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';


@Module({
  providers: [
    UserService,
    PrismaClientService
  ]
})
export class UserModule {}
