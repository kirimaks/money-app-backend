import { Logger, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { UserNotFoundError } from '../errors/user';
import { TransactionNotFoundError } from '../errors/transaction';
import { isString } from '../errors/typeguards';

import type {
  TransactionRepresentation,
  CreateTransactionInput,
  Transaction,
} from './transaction.types';

function transactionResponse(
  transaction: Transaction,
): TransactionRepresentation {
  return {
    id: transaction.id,
    name: transaction.name,
    amount: Number(transaction.amount_cents) / 100,
    timestamp: transaction.utc_timestamp.getTime(),
    categoryId: transaction.categoryId ?? '',
  };
}

@Injectable()
export class TransactionService {
  private readonly prisma: PrismaClientService;
  private readonly logger: Logger;

  constructor(prisma: PrismaClientService, logger: Logger) {
    this.prisma = prisma;
    this.logger = logger;
  }
  async createTransaction(
    userId: string,
    createTransactionInput: CreateTransactionInput,
  ): Promise<TransactionRepresentation> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const timestamp = new Date(parseInt(createTransactionInput.timestamp));
      const amount = Math.round(createTransactionInput.amount * 100);

      const newTransactionPayload = {
        data: {
          name: createTransactionInput.name,
          amount_cents: amount,
          utc_timestamp: timestamp, // TODO: validate as Date
          account: {
            connect: {
              id: user.accountId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
          category: {}
        },
      };

      if (isString(createTransactionInput.categoryId)) {
        newTransactionPayload.data.category = {
          connect: {
            id: createTransactionInput.categoryId
          }
        };
      }

      const transaction = await this.prisma.transaction.create(newTransactionPayload);

      return transactionResponse(transaction);

    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new UserNotFoundError('User not found');
      }

      this.logger.error(error);

      throw error;
    }
  }

  async getTransaction(
    userId: string,
    transactionId: string,
  ): Promise<TransactionRepresentation> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const transaction = await this.prisma.transaction.findUniqueOrThrow({
        where: {
          transaction_id_by_account: {
            accountId: user.accountId,
            id: transactionId,
          },
        },
      });

      return transactionResponse(transaction);
    } catch (error) {
      if (error instanceof Prisma.NotFoundError) {
        throw new TransactionNotFoundError('Transaction not found');
      }

      this.logger.error(error);

      throw error;
    }
  }
}
