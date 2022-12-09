import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';
import { GraphqlService } from './graphql/graphql.service';
import { GraphqlModule } from './graphql/graphql.module';
import { ProfileModule } from './profile/profile.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    PrismaClientModule,
    GraphqlModule,
    ProfileModule,
    TransactionModule,
    UserModule,
    TagsModule,
  ],
  providers: [PrismaClientService, GraphqlService],
})
export class AppModule {}
