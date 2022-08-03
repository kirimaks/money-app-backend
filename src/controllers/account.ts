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


function createAccountController(fastify:FastifyInstance, config:AppConfig): CreateAccountRequestHandler {
    async function create(request:CreateAccountRequest, reply:FastifyReply): Promise<void> {
        const account = new AccountModel(fastify, config);
        const newDoc:AccountDocument = account.createDocument(request.body);

        try {
            const modelResp:ModelCreateDocResponse<AccountDocument> = await account.saveDocument(newDoc);
            if (modelResp.success) {
                reply.code(201).send({
                    account_name: modelResp.document.account_name,
                    account_id: modelResp.document.account_id,
                });

            } else {
                reply.code(400).send({error: modelResp.errorMessage});
            }

        } catch(error) {
            fastify.log.error(`Cannot create account: ${error}`);

            reply.code(500).send({
                error: account.getModelResponseError(error),
            });
        }
    }

    return create;
}


function getAccountController(fastify:FastifyInstance, config:AppConfig): SearchAccountRequestHandler {
    async function getAccount(request:SearchAccountRequest, reply:FastifyReply): Promise<void> {
        const {account_id: accountId} = request.params;
        const account = new AccountModel(fastify, config);

        try {
            const modelResp:ModelSearchDocResponse<AccountDocument> = await account.getDocument(accountId);

            if (modelResp.errorMessage.length > 0) {
                reply.code(400).send({
                    error: modelResp.errorMessage
                });

            } else if (modelResp.found && modelResp.document) {
                reply.code(200).send({
                    account_name: modelResp.document.account_name
                });

            } else { 
                reply.code(404).send({error: 'Account not found'});
            }

        } catch(error) {
            fastify.log.error(`Cannot get account: ${error}`);

            reply.code(500).send({
                error: account.getModelResponseError(error),
            });
        }
    }

    return getAccount;
}


function deleteAccountController(fastify:FastifyInstance, config:AppConfig): DeleteAccountRequestHandler {
    async function deleteAccount(request:DeleteAccountRequest, reply:FastifyReply): Promise<void> {
        const accountId = request.params.account_id;
        const account = new AccountModel(fastify, config);

        try {
            const modelResp:ModelDeleteDocResponse<AccountDocument> = await account.removeDocument(accountId);
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
