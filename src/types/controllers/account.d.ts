type CreateAccountProperties = {
    Body: {
        account_name: string;
    }
};
type CreateAccountRequest = FastifyRequest<CreateAccountProperties>;
type CreateAccountRequestHandler = (request:CreateAccountRequest, reply:FastifyReply) => Promise<HttpError>;

type GetAccountProperties = {
    Params: {
        account_id: string;
    },
    Headers: {
        'x-control-header': string;
    }
};
type GetAccountRequest = FastifyRequest<GetAccountProperties>;
type GetAccountRequestHandler = (request:GetAccountRequest, reply:FastifyReply) => Promise<HttpError>;

type DeleteRequestProperties = {
    Params: {
        account_id: string;
    },
    Headers: {
        'x-control-header': string;
    }
};
type DeleteAccountRequest = FastifyRequest<DeleteRequestProperties>;
type DeleteAccountRequestHandler = (request:DeleteAccountRequest, reply:FastifyReply) => Promise<HttpError>;
