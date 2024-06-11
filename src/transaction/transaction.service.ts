import { Logger, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { PrismaClientService } from '../prisma-client/prisma-client.service';
import { UserNotFoundError } from '../errors/user';
import { TransactionNotFoundError } from '../errors/transaction';
import { isString } from '../errors/typeguards';

import type {
  TransactionRepresentation,
  Transaction,
  NewTransactionData,
  UpdateTransactionData,
  LatestTransactionsByDay,
  LatestTransactionsRange,
} from './transaction.types';

function transactionResponse(
  transaction: Transaction,
): TransactionRepresentation {
  return {
    id: transaction.id,
    name: transaction.name,
    amount: Number(transaction.amount_cents) / 100,
    datetime: dayjs.utc(transaction.utc_datetime).format(),
    tags: transaction.TransactionTags.map((tag) => ({
      id: tag.tagId,
      name: tag.tag.name,
      tagGroupId: tag.tag.tagGroupId,
      iconName: tag.tag.iconName,
    })),
  };
}

function getNewTagsQuery(tags: string[]) {
  return tags.map((tagId) => {
    return { tagId: tagId };
  });
}

function showData(responseBuff: any) {
  console.log(
    JSON.stringify(
      responseBuff,
      (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString();
        } else {
          return value;
        }
      },
      2,
    ),
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
      const datetime = new Date(newTransactionData.datetime);
      const amount = Math.round(newTransactionData.amount * 100);

      const newTransactionPayload = {
        data: {
          name: newTransactionData.name,
          amount_cents: amount,
          utc_datetime: datetime,
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
          TransactionTags: {},
        },
        include: {
          TransactionTags: {
            include: {
              tag: true,
            },
          },
        },
      };

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
          TransactionTags: {
            include: {
              tag: true,
            },
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
          TransactionTags: {
            include: {
              tag: true,
            },
          },
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

  async getLatestTransactions(
    transactionsRange: LatestTransactionsRange,
  ): Promise<LatestTransactionsByDay[]> {
    const timeRangeEnd = dayjs(transactionsRange.timeRangeEnd);
    const timeRangeStart = dayjs(transactionsRange.timeRangeStart);

    const responseBuff: Record<string, LatestTransactionsByDay> = {};

    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId: transactionsRange.accountId,
        utc_datetime: {
          gte: timeRangeStart.toDate(),
          lte: timeRangeEnd.toDate(),
        },
      },
      orderBy: {
        utc_datetime: 'desc',
      },
      take: 10000,
      include: {
        TransactionTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    for (const transaction of transactions) {
      const transactionDate = dayjs(transaction.utc_datetime)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .format();

      if (!(transactionDate in responseBuff)) {
        if (Object.keys(responseBuff).length >= 2) {
          break;
        } else {
          responseBuff[transactionDate] = {
            totalAmount: 0,
            date: transactionDate,
            transactions: [],
          };
        }
      }

      const transactionResp = transactionResponse(transaction);
      responseBuff[transactionDate].totalAmount += transactionResp.amount;
      responseBuff[transactionDate].transactions.push(transactionResp);
    }

    return Object.keys(responseBuff).map((key) => responseBuff[key]);
  }
}
