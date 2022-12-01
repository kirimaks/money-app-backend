import { Injectable } from '@nestjs/common';

import type { TransactionRepresentation, CreateTransactionInput  } from './transaction.types';


@Injectable()
export class TransactionService {
  createTransaction(userId:string, createTransactionInput:CreateTransactionInput): TransactionRepresentation {
    return {
      name: createTransactionInput.name,
      amount: createTransactionInput.amount,
      timestamp: createTransactionInput.timestamp
    }
  }
}
