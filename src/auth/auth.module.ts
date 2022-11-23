import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { JwtStrategy } from './auth.jwt.strategy';
import { AuthResolver } from './auth.resolvers';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'SOME_JWT_SECRET',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    PrismaClientService,
    Logger,
    JwtStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
