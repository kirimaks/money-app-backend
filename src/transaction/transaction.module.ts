import { Module, Logger } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolvers';
import { TransactionService } from './transaction.service';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

@Module({
  providers: [TransactionResolver, TransactionService, Logger, PrismaClientService]
})
export class TransactionModule {}
