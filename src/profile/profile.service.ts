import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { NotFoundError } from '../errors/search';
import { EmptyPayload } from '../errors/payload';

import type {
  ProfileRepresentation,
  ProfileUpdatePayload,
} from './profile.types';

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
    profileUpdatePayload: ProfileUpdatePayload,
  ): Promise<ProfileRepresentation> {
    // TODO: refactor types...
    const buff: ProfileUpdatePayload = {};
    const data: ProfileUpdatePayload = Object.entries(
      profileUpdatePayload,
    ).reduce((acc, obj) => {
      if (obj[1]) {
        const key = obj[0] as keyof ProfileUpdatePayload;
        acc[key] = obj[1];
      }
      return acc;
    }, buff);

    if (Object.keys(data).length) {
      try {
        const user = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: data,
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
      }
    }

    throw new EmptyPayload('Empty payload');
  }
}
