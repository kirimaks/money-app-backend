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
