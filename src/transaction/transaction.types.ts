export type TransactionRepresentation = {
  name: string;
  amount: number;
  timestamp: string;
};

export type CreateTransactionInput = {
  name: string;
  amount: number;
  timestamp: string;
};
