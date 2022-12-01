import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ProfileModule } from '../profile/profile.module';
import { AuthModule } from '../auth/auth.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        debug: true,
        playground: true,
        include: [ProfileModule, AuthModule, TransactionModule],
        typePaths: ['./**/*.graphql'],
      }),
    }),
  ],
})
export class GraphqlModule {}
