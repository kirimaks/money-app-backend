import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { NotFoundError } from '../errors/search';
import { EmptyPayload } from '../errors/payload';

import type {
  ProfileRepresentation,
} from './profile.types';
import type {
   UpdateProfileInput 
} from './profile.validation';

@Injectable()
export class ProfileService {
  private readonly prisma: PrismaClientService;

  constructor(prisma: PrismaClientService) {
    this.prisma = prisma;
  }

  async getProfile(userId: string): Promise<ProfileRepresentation> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async updateProfile(
    userId: string,
    updateProfileInput: UpdateProfileInput,
  ): Promise<ProfileRepresentation> {

      try {
        const user = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: updateProfileInput,
        });

        return {
          user: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        };
      } catch (error) {
        if (error instanceof Prisma.NotFoundError) {
          throw new NotFoundError('Record is not found');
        }

        throw error;
      }
  }
}
