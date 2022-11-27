import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PasswordTool } from '../auth/auth.hashing';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { getErrorMessage } from '../errors/tools';
import { EmailExistsError } from '../auth/auth.errors';

import type { NewAccountPayload, Account } from '../account/account.types';

@Injectable()
export class AccountService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;
  private readonly passwordTool: PasswordTool;

  constructor(prisma: PrismaClientService, logger: Logger) {
    this.prisma = prisma;
    this.logger = logger;
    this.passwordTool = new PasswordTool();
  }

  async createAccount(newAccount: NewAccountPayload): Promise<Account> {
    try {
      return await this.prisma.account.create({
        data: {
          name: newAccount.accountName,
          users: {
            create: [
              {
                email: newAccount.email,
                passwordHash: await this.passwordTool.hash(newAccount.password),
                firstName: newAccount.firstName,
                lastName: newAccount.lastName,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new EmailExistsError('Email exists');
        }
      }

      this.logger.error(error);

      throw new Error(`Cannot create user: ${getErrorMessage(error)}`);
    }
  }
}
