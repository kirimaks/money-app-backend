import { Logger, Injectable } from '@nestjs/common';

import { PrismaClientService } from '../prisma-client/prisma-client.service';

import type { TagGroupRepresentation, NewTagGroupPayload } from './tags.types';


@Injectable()
export class TagsService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;

  constructor(logger:Logger, prisma:PrismaClientService) {
    this.logger = logger;
    this.prisma = prisma;
  }

  async createTagGroup(payload:NewTagGroupPayload):Promise<TagGroupRepresentation> {
    try {
      const tagGroup = await this.prisma.tagGroup.create({
        data: {
          name: payload.name,
          account: {
            connect: {
              id: payload.accountId
            }
          }
        }
      });

      return {
        name: tagGroup.name,
        id: tagGroup.id,
      };

    } catch(error) {
      this.logger.error(error);
      throw error;
    }
  }
}
