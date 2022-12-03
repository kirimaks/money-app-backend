import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { NotFoundError } from '../errors/search';

import type { ProfileRepresentation } from './profile.types';
import type { UpdateProfileInput } from './profile.validation';

@Injectable()
export class ProfileService {
  private readonly prisma: PrismaClientService;

  constructor(prisma: PrismaClientService) {
    this.prisma = prisma;
  }

  async getProfile(userId: string): Promise<ProfileRepresentation> {
    const resp = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        account: true,
      },
    });

    return {
      user: {
        email: resp.email,
        firstName: resp.firstName,
        lastName: resp.lastName,
      },
      account: {
        name: resp.account.name,
      },
    };
  }

  async updateProfile(
    userId: string,
    updateProfileInput: UpdateProfileInput,
  ): Promise<ProfileRepresentation> {
    try {
      const resp = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: updateProfileInput,
        include: {
          account: true,
        },
      });

      return {
        user: {
          email: resp.email,
          firstName: resp.firstName,
          lastName: resp.lastName,
        },
        account: {
          name: resp.account.name,
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
