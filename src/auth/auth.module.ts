import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';


@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaClientService, Logger],
    imports: [
        JwtModule.register({
            secret: 'SOME_JWT_SECRET',
            signOptions: { expiresIn: '60s' }
        })
    ]
})
export class AuthModule {}
