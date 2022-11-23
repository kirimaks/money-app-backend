import {
  UseGuards,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { ProfileService } from './profile.service';
import { NotFoundError } from '../errors/search';
import { PROFILE_NOT_FOUND_ERROR } from './profile.constants';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';
import { UpdateProfileInput, updateProfileSchema } from './profile.validation';
import { ZodPipe } from '../pipes/zod.pipe';

import type { UserInRequest } from '../auth/auth.types';
import type { ProfileRepresentation } from './profile.types';

@Resolver('Profile')
export class ProfileResolver {
  private readonly profileService: ProfileService;
  private readonly logger: Logger;

  constructor(profileService: ProfileService, logger: Logger) {
    this.profileService = profileService;
    this.logger = logger;
  }

  @Query()
  @UseGuards(GQLJwtAuthGuard)
  async profile(
    @CurrentUser() user: UserInRequest,
  ): Promise<ProfileRepresentation> {
    try {
      return await this.profileService.getProfile(user.id);
    } catch (error) {
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
    @Args(new ZodPipe(updateProfileSchema))
    updateProfileInput: UpdateProfileInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<ProfileRepresentation> {
    try {
      return await this.profileService.updateProfile(
        user.id,
        updateProfileInput,
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(PROFILE_NOT_FOUND_ERROR);
      }

      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }
}
