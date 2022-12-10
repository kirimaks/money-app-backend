import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { CategoryNotFoundError } from '../errors/category';
import { UserService } from '../user/user.service';

import type { CategoryRepresentation } from './category.types';
import type { NewCategoryPayload } from './category.validation';

@Injectable()
export class CategoryService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;

  constructor(
    prisma: PrismaClientService,
    logger: Logger,
  ) {
    this.prisma = prisma;
    this.logger = logger;
  }

  async getCategory(
    accountId: string,
    categoryId: string,
  ): Promise<CategoryRepresentation> {
    try {
      const category = await this.prisma.category.findUniqueOrThrow({
        where: {
          category_id_by_account: {
            accountId: accountId,
            id: categoryId,
          },
        },
      });

      return {
        name: category.name,
        id: category.id,
      };
    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new CategoryNotFoundError('Category not found');
      }

      this.logger.error(error);

      throw error;
    }
  }

  async createCategory(
    payload: NewCategoryPayload,
  ): Promise<CategoryRepresentation> {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: payload.name,
          account: {
            connect: {
              id: payload.accountId,
            },
          },
        },
      });

      return {
        name: category.name,
        id: category.id,
      };
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }
}
