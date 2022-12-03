import { Logger, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { UserNotFound } from '../errors/user';

import type { TransactionRepresentation, CreateTransactionInput  } from './transaction.types';


@Injectable()
export class TransactionService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;

  constructor(prisma: PrismaClientService, logger:Logger) {
    this.prisma = prisma;
    this.logger = logger;
  }
  async createTransaction(userId:string, createTransactionInput:CreateTransactionInput): Promise<TransactionRepresentation> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        }
      });

      const timestamp = new Date(parseInt(createTransactionInput.timestamp));
      const amount = Math.round(createTransactionInput.amount * 100);

      const resp = await this.prisma.transaction.create({
        data: {
          name: createTransactionInput.name,
          amount_cents: amount,
          utc_timestamp: timestamp, // TODO: validate as Date
          account: { 
            connect: {
              id: user.accountId
            }
          },
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });

      return {
        id: resp.id,
        name: resp.name,
        amount: Number(resp.amount_cents) / 100,
        timestamp: resp.utc_timestamp.getTime(),
      }

    } catch(error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new UserNotFound('User not found');
      }

      this.logger.error(error);

      throw error;
    }
  }
}
