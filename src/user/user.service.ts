import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

import type { User } from '../user/user.types';

@Injectable()
export class UserService {
  private readonly prisma: PrismaClientService;

  constructor(prisma: PrismaClientService) {
    this.prisma = prisma;
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
    });
  }
}
