import {
  Logger,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { TagsService } from './tags.service';
import { createTagSchema } from './tags.validation';
import { ZodPipe } from '../pipes/zod.pipe';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';

import type { UserInRequest } from '../user/user.types';
import type { CreateTagInput } from './tags.validation';
import type { TagRepresentation } from './tags.types';

@Resolver('Tag')
export class TagsResolver {
  logger: Logger;
  tagsService: TagsService;

  constructor(logger: Logger, tagsService: TagsService) {
    this.logger = logger;
    this.tagsService = tagsService;
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async createTag(
    @Args(new ZodPipe(createTagSchema))
    createTagInput: CreateTagInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<TagRepresentation> {
    try {
      return await this.tagsService.createTag({
        name: createTagInput.name,
        tagGroupId: createTagInput.tagGroupId,
        accountId: user.accountId,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
