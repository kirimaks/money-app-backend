import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import type { User } from '../auth/auth.types';
import type { ProfileRepresentation } from './profile.types';


@Resolver('Profile')
export class ProfileResolver {
    constructor() { }
    
    @Query()
    @UseGuards(GQLJwtAuthGuard)
    async profile(@CurrentUser() user: User, @Args('token') token: string):Promise<ProfileRepresentation> {
        return {
            user: {
                email: user.email,
            }
        }
    }
}
