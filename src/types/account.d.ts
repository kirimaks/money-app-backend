/* Model types */
interface AccountRequestBody {
    account_name: string;
}

interface AccountDraft extends AccountRequestBody { }

interface MoneySource {
    source_name: string;
    source_id: string;
    source_icon: string;
}

interface AccountDocument extends AccountDraft {
    account_id: string;
    /* TODO: budgets, spendings, ... */
    money_sources: MoneySource[];
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

type CreateMoneySourceProperties = {
    body: {
        source_name: string;
        source_icon: string;
    }
};
type CreateMoneySourceRequest = FastifyRequest<CreateMoneySourceProperties>;
type CreateMoneySourceRequestHandler = (request:CreateMoneySourceRequest, reply:FastifyReply) => Promise<HttpError>;
