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
