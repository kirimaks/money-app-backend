interface AccountDraft {
    account_name: string;
}

interface AccountDocument extends AccountDraft {
    account_id: string;

    /* TODO: budgets, spendings, ... */
}
