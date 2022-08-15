interface TransactionDraft {
    timestamp: number;
    amount: number;
    category_id: string;
    description: string;
    spending_id?: string;
    saving_id?: string;
    budget_id?: string;
}

interface Transaction extends TransactionDraft {
    transaction_id: string;
    user_id: string;
    account_id: string;
}
