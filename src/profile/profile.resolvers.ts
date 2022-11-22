import { UseGuards, Logger, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { ProfileService } from './profile.service';
import { NotFoundError } from '../errors/search';

import type { User } from '../auth/auth.types';
import type { ProfileRepresentation } from './profile.types';


@Resolver('Profile')
export class ProfileResolver {
    private readonly profileService: ProfileService;
    private readonly logger: Logger;

    constructor(profileService:ProfileService, logger:Logger) { 
        this.profileService = profileService;
        this.logger = logger;
    }
    
    @Query()
    @UseGuards(GQLJwtAuthGuard)
    async profile(@CurrentUser() user: User, @Args('token') token: string):Promise<ProfileRepresentation> {

        try {
            return await this.profileService.getProfile(user.id);

        } catch(error) {
            if (error instanceof Prisma.NotFoundError) {
                throw new NotFoundException('Profile not found');
            }

            this.logger.error(error);
        }

        throw new InternalServerErrorException('Server error, try again');
    }
}
