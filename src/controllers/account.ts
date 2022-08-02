import {AccountModel} from '../models/account/account';

import type {FastifyRequest, FastifyReply, FastifyInstance} from 'fastify';


type SearchAccountProperties = {
    Params: {
        account_id: string;
    }
};

type CreateAccountProperties = {
    Body: {
        account_name: string;
    }
};

type DeleteRequestProperties = {
    Params: {
        account_id: string;
    }
};

type SearchAccountRequest = FastifyRequest<SearchAccountProperties>;
type CreateAccountRequest = FastifyRequest<CreateAccountProperties>;
type DeleteAccountRequest = FastifyRequest<DeleteRequestProperties>;

export type CreateAccountRequestHandler = (request:CreateAccountRequest, reply:FastifyReply) => Promise<void>;
export type SearchAccountRequestHandler = (request:SearchAccountRequest, reply:FastifyReply) => Promise<void>;
export type DeleteAccountRequestHandler = (request:DeleteAccountRequest, reply:FastifyReply) => Promise<void>;


function createAccountController(fastify:FastifyInstance): CreateAccountRequestHandler {
    async function create(request:CreateAccountRequest, reply:FastifyReply): Promise<void> {
        const accountName = request.body.account_name;
        const account:AccountModel = new AccountModel(fastify);

        try {
            const modelResp:ModelCreateDocResponse<AccountDocument> = await account.createAccount(accountName);
            if (modelResp.success) {
                reply.code(201).send({
                    account_name: modelResp.document.account_name,
                    account_id: modelResp.document.account_id,
                });

            } else {
                reply.code(500).send({error: 'Cannot create account'});
            }

        } catch(error) {
            fastify.log.error(`Cannot create account: ${error}`);

            const errorMessage = error instanceof Error ? error.message : 'Error message not provided';
            reply.code(500).send({error: errorMessage});
        }
    }

    return create;
}


function getAccountController(fastify:FastifyInstance): SearchAccountRequestHandler {
    async function getAccount(request:SearchAccountRequest, reply:FastifyReply): Promise<void> {
        const {account_id: accountId} = request.params;
        const account:AccountModel = new AccountModel(fastify);

        try {
            const modelResp:ModelSearchDocResponse<AccountDocument> = await account.getAccount(accountId);
            if (modelResp.found && modelResp.document) {
                reply.code(200).send({
                    account_name: modelResp.document.account_name
                });
            } else { 
                reply.code(404).send({error: 'Account not found'});
            }

        } catch(error) {
            fastify.log.error(`Cannot get account: ${error}`);

            const errorMessage = error instanceof Error ? error.message : 'Error message not provided';
            reply.code(500).send({error: errorMessage});
        }
    }

    return getAccount;
}


function deleteAccountController(fastify:FastifyInstance): DeleteAccountRequestHandler {
    async function deleteAccount(request:DeleteAccountRequest, reply:FastifyReply): Promise<void> {
        const accountId = request.params.account_id;
        const account:AccountModel = new AccountModel(fastify);

        try {
            const modelResp:ModelDeleteDocResponse<AccountDocument> = await account.removeAccount(accountId);
            if (modelResp.success) {
                reply.code(204).send({});
            } else { 
                reply.code(404).send({});
            }

        } catch(error) {
            fastify.log.error(`Cannot remove account: ${error}`);

            const errorMessage = error instanceof Error ? error.message : 'Error message not provided';
            reply.code(500).send({error: errorMessage});
        }
    }

    return deleteAccount;
}

export {
    createAccountController,
    getAccountController,
    deleteAccountController,
}
