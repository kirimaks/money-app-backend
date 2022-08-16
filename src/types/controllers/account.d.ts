type CreateAccountProperties = {
    body: {
        account_name: string;
    }
};
type CreateAccountRequest = FastifyRequest<CreateAccountProperties>;
type CreateAccountRequestHandler = (request:CreateAccountRequest, reply:FastifyReply) => Promise<HttpError>;

type GetAccountProperties = {
    params: {
        account_id: string;
    },
};
type GetAccountRequest = FastifyRequest<GetAccountProperties>;
type GetAccountRequestHandler = (request:GetAccountRequest, reply:FastifyReply) => Promise<HttpError>;

type DeleteRequestProperties = {
    params: {
        account_id: string;
    },
};
type DeleteAccountRequest = FastifyRequest<DeleteRequestProperties>;
type DeleteAccountRequestHandler = (request:DeleteAccountRequest, reply:FastifyReply) => Promise<HttpError>;
