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

type CreateTransactionProperties = {
    body: NewTransactionRequestBody;
};
type CreateTransactionRequest = FastifyRequest<CreateTransactionProperties>;
type CreateTransactionRequestHandler = (request:CreateTransactionRequest, reply:FastifyReply) => Promise<HttpError>;

type GetTransactionProperties = {
    params: {
        transaction_id: string;
    }
};
type GetTransactionRequest = FastifyRequest<GetTransactionProperties>;
type GetTransactionRequestHandler = (request:GetTransactionRequest, reply:FastifyReply) => Promise<HttpError>;

type DeleteTransactionProperties = {
    params: {
        transaction_id: string;
    }
};
type DeleteTransactionRequest = FastifyRequest<DeleteTransactionProperties>;
type DeleteTransactionRequestHandler = (request:DeleteTransactionRequest, reply:FastifyReply) => Promise<HttpError>;
