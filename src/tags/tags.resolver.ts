import {
  Logger,
  UseGuards,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';

import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { TagsService } from './tags.service';
import { 
  createTagSchema, deleteTagSchema, transactionsByTagAggregationSchema, TransactionsByTagAggregationInput
} from './tags.validation';
import { ZodPipe } from '../pipes/zod.pipe';
import { INTERNAL_SERVER_ERROR } from '../errors/constants';
import { TagNotFoundError, TagExistError } from './tags.errors';
import { TAG_NOT_FOUND_ERROR, TAG_EXIST_ERROR } from './tags.constants';

import type { UserInRequest } from '../user/user.types';
import type { CreateTagInput, DeleteTagInput } from './tags.validation';
import type {
  TagRepresentation,
  TagGroupRepresentation,
  DeleteTagResponse,
  TransactionsByTagAggregationRecord
} from './tags.types';

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
        iconName: createTagInput.iconName,
        accountId: user.accountId,
      });
    } catch (error) {
      if (error instanceof TagExistError) {
        throw new BadRequestException(TAG_EXIST_ERROR);
      }

      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async deleteTag(
    @Args(new ZodPipe(deleteTagSchema))
    deleteTagInput: DeleteTagInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<DeleteTagResponse> {
    try {
      return await this.tagsService.deleteTag(
        deleteTagInput.tagId,
        user.accountId,
      );
    } catch (error) {
      if (error instanceof TagNotFoundError) {
        throw new BadRequestException(TAG_NOT_FOUND_ERROR);
      }

      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }

  @Query()
  @UseGuards(GQLJwtAuthGuard)
  async accountTags(
    @CurrentUser() user: UserInRequest,
  ): Promise<TagGroupRepresentation[]> {
    try {
      return await this.tagsService.accountTags(user.accountId);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }

  @Query()
  @UseGuards(GQLJwtAuthGuard)
  async transactionsByTagCounters(
    @Args(new ZodPipe(transactionsByTagAggregationSchema)) 
    transactionsByTagAggregationInput: TransactionsByTagAggregationInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<TransactionsByTagAggregationRecord[]> {
    try {
      return await this.tagsService.transactionsByTagAggregation(
        user.accountId, 
        transactionsByTagAggregationInput.timeRangeStart, 
        transactionsByTagAggregationInput.timeRangeEnd
      );

    } catch(error) {
      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
