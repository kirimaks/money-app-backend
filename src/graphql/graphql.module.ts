import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { ProfileModule } from '../profile/profile.module';


@Module({
    imports: [
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: () => ({
                debug: true,
                playground: true,
                include: [ProfileModule],
                typePaths: ['./**/*.graphql'],
            })
        }),
    ]
})
export class GraphqlModule {}
