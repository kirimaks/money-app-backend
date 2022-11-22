import { Module, Logger } from '@nestjs/common';
import { ProfileResolver } from './profile.resolvers';
import { ProfileService } from './profile.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

@Module({
  providers: [ProfileResolver, ProfileService, PrismaClientService, Logger],
})
export class ProfileModule {}
