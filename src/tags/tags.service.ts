import { Logger, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { DEFAULT_TAGS } from './tags.default';
import {
  TagGroupExistError,
  TagGroupNotFoundError,
  TagNotFoundError,
  TagExistError,
} from './tags.errors';
import {
  TAG_GROUP_REMOVED,
  TAG_GROUP_NOT_FOUND_ERROR,
  TAG_REMOVED,
  TAG_NOT_FOUND_ERROR,
  TAG_EXIST_ERROR,
} from './tags.constants';

import type {
  TagGroupRepresentation,
  NewTagGroupPayload,
  NewTagPayload,
  TagRepresentation,
  NewTag,
  DeleteTagGroupResponse,
  DeleteTagResponse,
} from './tags.types';

@Injectable()
export class TagsService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;

  constructor(logger: Logger, prisma: PrismaClientService) {
    this.logger = logger;
    this.prisma = prisma;
  }

  async createTagGroup(
    payload: NewTagGroupPayload,
  ): Promise<TagGroupRepresentation> {
    try {
      const tagGroup = await this.prisma.tagGroup.create({
        data: {
          name: payload.name,
          iconName: payload.iconName,
          account: {
            connect: {
              id: payload.accountId,
            },
          },
        },
      });

      return {
        name: tagGroup.name,
        id: tagGroup.id,
        iconName: tagGroup.iconName,
        tags: [],
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new TagGroupExistError('Tag group exist');
        }
      }

      this.logger.error(error);
      throw error;
    }
  }

  async createTag(payload: NewTagPayload): Promise<TagRepresentation> {
    try {
      const tag = await this.prisma.tag.create({
        data: {
          name: payload.name,
          account: {
            connect: {
              id: payload.accountId,
            },
          },
          tagGroup: {
            connect: {
              id: payload.tagGroupId,
            },
          },
          iconName: payload.iconName,
        },
      });

      return {
        name: tag.name,
        id: tag.id,
        tagGroupId: tag.tagGroupId,
        iconName: tag.iconName,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new TagExistError(TAG_EXIST_ERROR);
        }
      }

      this.logger.error(error);
      throw error;
    }
  }

  async accountTags(accountId: string): Promise<TagGroupRepresentation[]> {
    try {
      return await this.prisma.tagGroup.findMany({
        where: {
          accountId: accountId,
        },
        include: {
          tags: {
            orderBy: {
              name: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createDefaultTags(accountId: string): Promise<void> {
    const newTagQueries = [];

    for (const tagGroup of DEFAULT_TAGS) {
      newTagQueries.push({
        name: tagGroup.groupName,
        accountId: accountId,
        iconName: tagGroup.iconName,
        tags: {
          create: tagGroup.tags.map((tag: NewTag) => {
            return {
              name: tag.name,
              accountId: accountId,
              iconName: tag.iconName,
            };
          }),
        },
      });
    }

    const queries = newTagQueries.map((queryData) => {
      return this.prisma.tagGroup.create({
        data: queryData,
      });
    });

    await Promise.all(queries);

    this.logger.debug('Default tags created');
  }

  async deleteTagGroup(
    tagGroupId: string,
    accountId: string,
  ): Promise<DeleteTagGroupResponse> {
    try {
      const deleteTagGroup = await this.prisma.tagGroup.delete({
        where: {
          group_id_by_account: {
            id: tagGroupId,
            accountId: accountId,
          },
        },
      });

      return {
        status: TAG_GROUP_REMOVED,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new TagGroupNotFoundError(TAG_GROUP_NOT_FOUND_ERROR);
        }
      }

      this.logger.error(error);
      throw error;
    }
  }

  async deleteTag(
    tagId: string,
    accountId: string,
  ): Promise<DeleteTagResponse> {
    try {
      const deleteTag = await this.prisma.tag.delete({
        where: {
          tag_name_by_account: {
            id: tagId,
            accountId: accountId,
          },
        },
      });

      return {
        status: TAG_REMOVED,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new TagNotFoundError(TAG_NOT_FOUND_ERROR);
        }
      }
      this.logger.error(error);
      throw error;
    }
  }
}
