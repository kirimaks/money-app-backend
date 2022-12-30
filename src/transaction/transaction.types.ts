import type { TransactionTags } from '../tags/tags.types';
import type { UpdateTransactionInput } from './transaction.validation';

type Timestamp = string;

export type TransactionRepresentation = {
  name: string;
  amount: number;
  timestamp: number;
  id: string;
  categoryId: string;
  tagIds: string[];
};

// TODO: infer from Zod
export type CreateTransactionInput = {
  name: string;
  amount: number;
  timestamp: Timestamp;
  categoryId?: string; // TODO: remove
  tagIds?: string[];
};

export type GetTransactionInput = {
  id: string;
};

export type Transaction = {
  id: string;
  name: string;
  amount_cents: bigint;
  utc_timestamp: Date;
  categoryId: null | string;
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
