import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { GraphqlService } from './graphql/graphql.service';
import { GraphqlModule } from './graphql/graphql.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaClientModule,
    GraphqlModule,
    ProfileModule,
  ],
  providers: [PrismaClientService, GraphqlService],
})
export class AppModule {}
