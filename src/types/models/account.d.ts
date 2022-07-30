interface AccountModel {
    fastify: FastifyInstance;
    createAccount(accountName:string): Promise<ModelCreateDocResponse<AccountDocument>>;
    getAccount(accountId:string): Promise<ModelSearchDocResponse<AccountDocument>>;
    removeAccount(accountId:string): Promise<ModelDeleteDocResponse<AccountDocument>>;
}

interface AccountDocument {
    account_id: string;
    account_name: string;
}
