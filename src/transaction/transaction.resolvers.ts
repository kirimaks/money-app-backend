import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { UseGuards, InternalServerErrorException, Logger } from '@nestjs/common';

import { INTERNAL_SERVER_ERROR } from '../errors/constants';
import { TransactionService } from './transaction.service';
import { ZodPipe } from '../pipes/zod.pipe';
import { createTransactionSchema } from './transaction.validation';
import { GQLJwtAuthGuard, CurrentUser } from '../auth/auth.jwt.guard';

import type { TransactionRepresentation, CreateTransactionInput } from './transaction.types';
import type { UserInRequest } from '../user/user.types';


@Resolver('Transaction')
export class TransactionResolver {
  private readonly transactionService: TransactionService;
  private readonly logger: Logger;

  constructor(logger:Logger, transactionService: TransactionService) {
    this.transactionService = transactionService;
    this.logger = logger;
  }

  @Mutation()
  @UseGuards(GQLJwtAuthGuard)
  async createTransaction(
    @Args(new ZodPipe(createTransactionSchema)) createTransactionInput: CreateTransactionInput,
    @CurrentUser() user: UserInRequest
  ): Promise<TransactionRepresentation> {

    try {
      return await this.transactionService.createTransaction(user.id, createTransactionInput);

    } catch(error) {
      this.logger.error(error);
    }

    throw new InternalServerErrorException(INTERNAL_SERVER_ERROR);
  }
}
