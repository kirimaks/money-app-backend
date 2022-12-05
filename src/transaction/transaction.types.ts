type Timestamp = string;

export type TransactionRepresentation = {
  name: string;
  amount: number;
  timestamp: number;
  id: string;
  categoryId: string;
};

export type CreateTransactionInput = {
  name: string;
  amount: number;
  timestamp: Timestamp;
  categoryId?: string;
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
};

export type NewTransactionData = {
  userId: string;
  accountId: string;
} & CreateTransactionInput;
