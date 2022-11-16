import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';


@Module({
  imports: [AuthModule, PrismaClientModule],
  providers: [PrismaClientService],
})
export class AppModule {}
