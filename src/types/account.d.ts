/* Model types */
interface AccountRequestBody {
    account_name: string;
}

interface AccountDraft extends AccountRequestBody { }

interface AccountDocument extends AccountDraft {
    account_id: string;
    /* TODO: budgets, spendings, ... */
}

/* Request types */
type CreateAccountProperties = {
    body: AccountRequestBody;
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
