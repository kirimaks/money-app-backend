import { 
    UseGuards, Logger, NotFoundException, InternalServerErrorException, 
    BadRequestException 
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { ProfileService } from './profile.service';
import { NotFoundError } from '../errors/search';
import { EmptyPayload } from '../errors/payload';
import { PROFILE_NOT_FOUND_ERROR, PROFILE_UPDATE_EMPTY_PAYLOAD_ERROR } from './profile.constants';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';

import type { UserInRequest } from '../auth/auth.types';
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
    async profile(@CurrentUser() user: UserInRequest):Promise<ProfileRepresentation> {
        try {
            return await this.profileService.getProfile(user.id);

        } catch(error) {
            if (error instanceof NotFoundError) {
                throw new NotFoundException(PROFILE_NOT_FOUND_ERROR);
            }

            this.logger.error(error);
        }

        throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }

    @Mutation()
    @UseGuards(GQLJwtAuthGuard)
    async updateProfile(
        @CurrentUser() user:UserInRequest, 
        @Args('firstName') firstName?:string, 
        @Args('lastName') lastName?:string

    ):Promise<ProfileRepresentation> {
        try {
            return await this.profileService.updateProfile(user.id, {firstName, lastName});

        } catch(error) {
            if (error instanceof NotFoundError) { 
                throw new NotFoundException(PROFILE_NOT_FOUND_ERROR);
            }

            if (error instanceof EmptyPayload) {
                throw new BadRequestException(PROFILE_UPDATE_EMPTY_PAYLOAD_ERROR);
            }

            this.logger.error(error);
        }

        throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
}
