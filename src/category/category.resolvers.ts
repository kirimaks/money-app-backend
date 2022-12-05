import {
  Logger,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { ZodPipe } from '../pipes/zod.pipe';
import { CategoryService } from './category.service';
import { getCategorySchema, createCategorySchema } from './category.validation';
import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import {
  INTERNAL_SERVER_ERROR,
  CATEGORY_NOT_FOUND_ERROR,
} from '../errors/constants';
import { CategoryNotFoundError } from '../errors/category';

import type { CategoryRepresentation } from './category.types';
import type {
  GetCategoryInput,
  CreateCategoryInput,
} from './category.validation';
import type { UserInRequest } from '../user/user.types';

@Resolver('Category')
export class CategoryResolver {
  private readonly categoryService: CategoryService;
  private readonly logger: Logger;

  constructor(logger: Logger, categoryService: CategoryService) {
    this.logger = logger;
    this.categoryService = categoryService;
  }

  @Query()
  @UseGuards(GQLJwtAuthGuard)
  async category(
    @Args(new ZodPipe(getCategorySchema)) getCategoryInput: GetCategoryInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<CategoryRepresentation> {
    try {
      return await this.categoryService.getCategory(
        user.id,
        getCategoryInput.id,
      );
    } catch (error) {
      if (error instanceof CategoryNotFoundError) {
        throw new NotFoundException(CATEGORY_NOT_FOUND_ERROR);
      }

      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async createCategory(
    @Args(new ZodPipe(createCategorySchema))
    createCategoryInput: CreateCategoryInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<CategoryRepresentation> {
    try {
      return await this.categoryService.createCategory(user.id, {
        name: createCategoryInput.name,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
    }
  }
}
