/* Received form user */
interface NewTransactionRequestBody {
    amount: number;
    category_id?: string;
    description?: string;
    spending_id?: string;
    saving_id?: string;
    budget_id?: string;
}

/* Prepared */
interface TransactionDraft extends NewTransactionRequestBody {
    user_id: string;
    account_id: string;
}

/* Saved to db */
interface TransactionDocument extends TransactionDraft {
    transaction_id: string;
    timestamp: number;
}
