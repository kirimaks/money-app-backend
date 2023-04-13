import {
  Logger,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';
import { TagsService } from './tags.service';
import { createTagGroupSchema } from './tags.validation';
import { ZodPipe } from '../pipes/zod.pipe';

import type { UserInRequest } from '../user/user.types';
import type { TagGroupRepresentation } from './tags.types';
import type { CreateTagGroupInput } from './tags.validation';

@Resolver('TagGroup')
export class TagGroupResolver {
  logger: Logger;
  tagsService: TagsService;

  constructor(logger: Logger, tagsService: TagsService) {
    this.logger = logger;
    this.tagsService = tagsService;
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async createTagGroup(
    @Args(new ZodPipe(createTagGroupSchema))
    createTagGroupInput: CreateTagGroupInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<TagGroupRepresentation> {
    try {
      return await this.tagsService.createTagGroup({
        name: createTagGroupInput.name,
        accountId: user.accountId,
        icon: createTagGroupInput.icon,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
