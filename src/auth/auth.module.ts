import { Module, Logger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';


@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaClientService, Logger]
})
export class AuthModule {}
