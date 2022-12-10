import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ProfileModule } from '../profile/profile.module';
import { AuthModule } from '../auth/auth.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CategoryModule } from '../category/category.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        debug: true,
        playground: true,
        include: [ProfileModule, AuthModule, TransactionModule, CategoryModule, TagsModule],
        typePaths: ['./**/*.graphql'],
      }),
    }),
  ],
})
export class GraphqlModule {}
