import { Logger, Injectable } from '@nestjs/common';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { DEFAULT_TAGS } from './tags.default';

import type {
  TagGroupRepresentation,
  NewTagGroupPayload,
  NewTagPayload,
  TagRepresentation,
  NewTag,
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
          iconInfo: payload.icon,
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
        iconInfo: tagGroup.iconInfo,
        tags: [],
      };
    } catch (error) {
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
        },
      });

      return {
        name: tag.name,
        id: tag.id,
        tagGroupId: tag.tagGroupId,
      };
    } catch (error) {
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
            }
          },
        },
        orderBy: {
          name: 'asc',
        }
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
        iconInfo: tagGroup.iconInfo,
        tags: {
          create: tagGroup.tags.map((tag: NewTag) => {
            return {
              name: tag.name,
              accountId: accountId,
              iconInfo: tag.iconInfo,
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
}
