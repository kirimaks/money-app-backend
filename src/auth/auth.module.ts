import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { JwtStrategy } from './auth.jwt.strategy';
import { AuthResolver } from './auth.resolvers';
import { AccountService } from '../account/account.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_LIFETIME },
    }),
  ],
  providers: [
    AuthService,
    PrismaClientService,
    Logger,
    JwtStrategy,
    AuthResolver,
    AccountService,
    UserService,
  ],
})
export class AuthModule {}
