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
  USER_NOT_FOUND_ERROR
} from '../errors/constants';
import { TransactionService } from './transaction.service';
import { ZodPipe } from '../pipes/zod.pipe';
import {
  createTransactionSchema,
  getTransactionSchema,
} from './transaction.validation';
import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';
import { TransactionNotFoundError } from '../errors/transaction';
import { UserNotFoundError } from '../errors/user';

import type {
  TransactionRepresentation,
  CreateTransactionInput,
  GetTransactionInput,
} from './transaction.types';
import type { UserInRequest } from '../user/user.types';

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
        user.id,
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
      return await this.transactionService.createTransaction(
        user.id,
        createTransactionInput,
      );
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(USER_NOT_FOUND_ERROR);
      }
      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }
}
