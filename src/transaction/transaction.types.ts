type Timestamp = string;

export type TransactionRepresentation = {
  name: string;
  amount: number;
  timestamp: number;
  id: string;
};

export type CreateTransactionInput = {
  name: string;
  amount: number;
  timestamp: Timestamp;
};

export type GetTransactionInput = {
  id: string;
};

export type Transaction = {
  id: string;
  name: string;
  amount_cents: bigint;
  utc_timestamp: Date;
};
