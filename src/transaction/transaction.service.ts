import { Logger, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs'

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { UserNotFoundError } from '../errors/user';
import { TransactionNotFoundError } from '../errors/transaction';
import { isString } from '../errors/typeguards';

import type {
  TransactionRepresentation,
  Transaction,
  NewTransactionData,
  UpdateTransactionData,
  LatestTransactionsByDay
} from './transaction.types';

function transactionResponse(
  transaction: Transaction,
): TransactionRepresentation {
  return {
    id: transaction.id,
    name: transaction.name,
    amount: Number(transaction.amount_cents) / 100,
    timestamp: transaction.utc_timestamp.getTime(),
    categoryId: transaction.categoryId ?? '', // TODO: remove
    tagIds: transaction.TransactionTags.map((tag) => tag.tagId),
  };
}

function getNewTagsQuery(tags: string[]) {
  return tags.map((tagId) => {
    return { tagId: tagId };
  });
}

function showData(responseBuff:any) {
  console.log(
    JSON.stringify(
      responseBuff, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();

        } else {
          return value;
        }
      }, 2
    )
  );
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
    newTransactionData: NewTransactionData,
  ): Promise<TransactionRepresentation> {
    try {
      const timestamp = new Date(parseInt(newTransactionData.timestamp));
      const amount = Math.round(newTransactionData.amount * 100);

      const newTransactionPayload = {
        data: {
          name: newTransactionData.name,
          amount_cents: amount,
          utc_timestamp: timestamp,
          account: {
            connect: {
              id: newTransactionData.accountId,
            },
          },
          user: {
            connect: {
              id: newTransactionData.userId,
            },
          },
          category: {}, // TODO: remove
          TransactionTags: {},
        },
        include: {
          TransactionTags: true,
        },
      };

      // TODO: remove
      if (isString(newTransactionData.categoryId)) {
        newTransactionPayload.data.category = {
          connect: {
            id: newTransactionData.categoryId,
          },
        };
      }

      if (newTransactionData.tagIds && newTransactionData.tagIds.length > 0) {
        const newTagsQuery = getNewTagsQuery(newTransactionData.tagIds);

        newTransactionPayload.data.TransactionTags = {
          create: newTagsQuery,
        };
      }

      const transaction = await this.prisma.transaction.create(
        newTransactionPayload,
      );

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
    accountId: string,
    transactionId: string,
  ): Promise<TransactionRepresentation> {
    try {
      const transaction = await this.prisma.transaction.findUniqueOrThrow({
        where: {
          transaction_id_by_account: {
            accountId: accountId,
            id: transactionId,
          },
        },
        include: {
          TransactionTags: true,
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

  async updateTransaction(
    updateTransactionData: UpdateTransactionData,
  ): Promise<TransactionRepresentation> {
    try {
      const updateQuery = {
        where: {
          transaction_id_by_account: {
            accountId: updateTransactionData.accountId,
            id: updateTransactionData.transactionId,
          },
        },
        data: {},
        include: {
          TransactionTags: true,
        },
      };

      if (
        updateTransactionData.tagIds &&
        updateTransactionData.tagIds.length > 0
      ) {
        const newTagsQuery = getNewTagsQuery(updateTransactionData.tagIds);

        updateQuery.data = {
          TransactionTags: {
            create: newTagsQuery,
          },
        };
      }

      const transaction = await this.prisma.transaction.update(updateQuery);

      return transactionResponse(transaction);
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async getLatestTransactions(accountId: string):Promise<LatestTransactionsByDay[]> {
    const monthStart = dayjs().startOf('month');
    const monthEnd = dayjs().endOf('month');

    const responseBuff:Record<string, LatestTransactionsByDay>= {};

    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId: accountId,
        utc_timestamp: {
          gte: monthStart.toDate(),
          lte: monthEnd.toDate(),
        }
      },
      orderBy: {
        utc_timestamp: 'desc',
      },
      take: 10000,
      include: {
        TransactionTags: true
      }
    });

    for (const transaction of transactions) {
      const transactionDate = dayjs(transaction.utc_timestamp).format('DD-MM-YYYY');

      if (!(transactionDate in responseBuff)) {
        if (Object.keys(responseBuff).length >= 2) {
          break;

        } else {
          responseBuff[transactionDate] = {
            totalAmount: 0,
            date: transactionDate,
            transactions: []
          }
        }
      }

      const transactionResp = transactionResponse(transaction);
      responseBuff[transactionDate].totalAmount += transactionResp.amount;
      responseBuff[transactionDate].transactions.push(transactionResp);
    }

    return Object.keys(responseBuff).map((key) => responseBuff[key]);
  }
}
