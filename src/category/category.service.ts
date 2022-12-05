import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { CategoryNotFoundError } from '../errors/category';
import { UserService } from '../user/user.service';

import type { CategoryRepresentation } from './category.types';
import type { CreateCategoryInput } from './category.validation';


@Injectable()
export class CategoryService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;
  private readonly userService: UserService;

  constructor(prisma:PrismaClientService, logger:Logger, userService: UserService) {
    this.prisma = prisma;
    this.logger = logger;
    this.userService = userService;
  }

  // TODO: send accountId, remove user query
  async getCategory(userId:string, categoryId:string):Promise<CategoryRepresentation> {
    try {
      const user = await this.userService.getUser(userId);
      const category = await this.prisma.category.findUniqueOrThrow({ 
        where: {
          category_id_by_account: {
            accountId: user.accountId,
            id: categoryId,
          }
        }
      });

      return {
        name: category.name,
        id: category.id,
      }

    } catch(error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new CategoryNotFoundError('Category not found');
      }

      this.logger.error(error);

      throw error;
    }
  }

  async createCategory(userId:string, payload:CreateCategoryInput):Promise<CategoryRepresentation> {
    try {
      const user = await this.userService.getUser(userId);
      const category = await this.prisma.category.create({
        data: {
          name: payload.name,
          account:{
            connect: {
              id: user.accountId,
            }
          }
        }
      });

      return {
        name: category.name,
        id: category.id
      };

    } catch(error) {
      this.logger.error(error);

      throw error;
    }
  }
}
