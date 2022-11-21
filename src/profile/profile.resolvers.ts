import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { User } from '../auth/auth.types';


@Resolver('Profile')
export class ProfileResolver {
    constructor() { }
    
    @Query()
    @UseGuards(GQLJwtAuthGuard)
    async profile(@CurrentUser() user: User, @Args('token') token: string) {
        console.log('Token: ', token);
        console.log('User:', user);

        return {
            user: {
                uuid: user.id,
                email: user.email,
            }
        }
    }
}
