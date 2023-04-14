import {
  Logger,
  UseGuards,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';
import { TagsService } from './tags.service';
import { ZodPipe } from '../pipes/zod.pipe';
import { TAG_GROUP_EXIST_ERROR, TAG_GROUP_NOT_FOUND_ERROR } from './tags.constants';
import { TagGroupExistError } from './tags.errors';
import { createTagGroupSchema, deleteTagGroupSchema } from './tags.validation';
import { TagGroupNotFoundError } from './tags.errors';

import type { UserInRequest } from '../user/user.types';
import type { TagGroupRepresentation, DeleteTagGroupResponse } from './tags.types';
import type { CreateTagGroupInput, DeleteTagGroupInput } from './tags.validation';

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
        iconName: createTagGroupInput.iconName,
      });
    } catch (error) {
      if (error instanceof TagGroupExistError) {
          throw new BadRequestException(TAG_GROUP_EXIST_ERROR);
      }

      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async deleteTagGroup(
    @Args(new ZodPipe(deleteTagGroupSchema))
    deleteTagGroupInput: DeleteTagGroupInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<DeleteTagGroupResponse> {
    try {
        return await this.tagsService.deleteTagGroup(deleteTagGroupInput.tagGroupId, user.accountId);
    } catch (error) {
      if (error instanceof TagGroupNotFoundError) {
        throw new BadRequestException(TAG_GROUP_NOT_FOUND_ERROR);
      }

      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
