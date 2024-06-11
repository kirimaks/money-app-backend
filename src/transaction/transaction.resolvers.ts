import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import {
  UseGuards,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  INTERNAL_SERVER_ERROR,
  TRANSACTION_NOT_FOUND_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../errors/constants';
import { TransactionService } from './transaction.service';
import { ZodPipe } from '../pipes/zod.pipe';
import {
  createTransactionSchema,
  getTransactionSchema,
  updateTransactionSchema,
  latestTransactionsSchema,
} from './transaction.validation';
import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { TransactionNotFoundError } from '../errors/transaction';
import { UserNotFoundError } from '../errors/user';

import type {
  TransactionRepresentation,
  GetTransactionInput,
  LatestTransactionsByDay,
} from './transaction.types';
import type { UserInRequest } from '../user/user.types';
import type {
  UpdateTransactionInput,
  LatestTransactionsInput,
  CreateTransactionInput,
} from './transaction.validation';

@Resolver('Transaction')
export class TransactionResolver {
  private readonly transactionService: TransactionService;
  private readonly logger: Logger;

  constructor(logger: Logger, transactionService: TransactionService) {
    this.transactionService = transactionService;
    this.logger = logger;
  }

  @Query()
  @UseGuards(GQLJwtAuthGuard)
  async transaction(
    @Args(new ZodPipe(getTransactionSchema))
    getTransactionInput: GetTransactionInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<TransactionRepresentation> {
    try {
      const transactionId = getTransactionInput.id;
      return await this.transactionService.getTransaction(
        user.accountId,
        transactionId,
      );
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        throw new NotFoundException(TRANSACTION_NOT_FOUND_ERROR);
      }

      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async createTransaction(
    @Args(new ZodPipe(createTransactionSchema))
    createTransactionInput: CreateTransactionInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<TransactionRepresentation> {
    try {
      return await this.transactionService.createTransaction({
        userId: user.id,
        accountId: user.accountId,
        ...createTransactionInput,
      });
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(USER_NOT_FOUND_ERROR);
      }
      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async updateTransaction(
    @Args(new ZodPipe(updateTransactionSchema))
    updateTransactionInput: UpdateTransactionInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<TransactionRepresentation> {
    try {
      return await this.transactionService.updateTransaction({
        accountId: user.accountId,
        ...updateTransactionInput,
      });
    } catch (error) {
      if (error instanceof TransactionNotFoundError) {
        throw new NotFoundException(TRANSACTION_NOT_FOUND_ERROR);
      }
      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }

  @Query()
  @UseGuards(GQLJwtAuthGuard)
  async latestTransactions(
    @Args(new ZodPipe(latestTransactionsSchema))
    latestTransactionsInput: LatestTransactionsInput,
    @CurrentUser() user: UserInRequest,
  ): Promise<LatestTransactionsByDay[]> {
    try {
      return await this.transactionService.getLatestTransactions({
        accountId: user.accountId,
        timeRangeStart: latestTransactionsInput.timeRangeStart,
        timeRangeEnd: latestTransactionsInput.timeRangeEnd,
      });
    } catch (error) {
      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }
}
