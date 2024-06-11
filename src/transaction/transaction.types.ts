import type { TransactionTags } from '../tags/tags.types';
import type {
  UpdateTransactionInput,
  CreateTransactionInput,
} from './transaction.validation';
import type { Tag } from '../tags/tags.types';

export type TransactionRepresentation = {
  name: string;
  amount: number;
  datetime: string;
  id: string;
  tags: Tag[];
};

export type GetTransactionInput = {
  id: string;
};

export type Transaction = {
  id: string;
  name: string;
  amount_cents: bigint;
  utc_datetime: Date;
  TransactionTags: TransactionTags[];
};

export type NewTransactionData = {
  userId: string;
  accountId: string;
} & CreateTransactionInput;

export type UpdateTransactionData = {
  accountId: string;
} & UpdateTransactionInput;

export type LatestTransactionsByDay = {
  totalAmount: number;
  date: string;
  transactions: TransactionRepresentation[];
};

export type LatestTransactionsRange = {
  accountId: string;
  timeRangeStart: string;
  timeRangeEnd: string;
};
