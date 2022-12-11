import type { TransactionTags } from '../tags/tags.types';

type Timestamp = string;

export type TransactionRepresentation = {
  name: string;
  amount: number;
  timestamp: number;
  id: string;
  categoryId: string;
  tagIds: string[];
};

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
