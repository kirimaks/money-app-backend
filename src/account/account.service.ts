import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PasswordTool } from '../auth/auth.hashing';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { getErrorMessage } from '../errors/tools';
import { EmailExistsError } from '../auth/auth.errors';
import { TagsService } from '../tags/tags.service';

import type { NewAccountPayload, Account } from '../account/account.types';

@Injectable()
export class AccountService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;
  private readonly passwordTool: PasswordTool;
  private readonly tagsService: TagsService;

  constructor(
    prisma: PrismaClientService,
    logger: Logger,
    tagsService: TagsService,
  ) {
    this.prisma = prisma;
    this.logger = logger;
    this.passwordTool = new PasswordTool();
    this.tagsService = tagsService;
  }

  async createAccount(newAccount: NewAccountPayload): Promise<Account> {
    try {
      const account = await this.prisma.account.create({
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

      await this.tagsService.createDefaultTags(account.id);

      return account;
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
