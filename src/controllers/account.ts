import type {FastifyReply, FastifyInstance} from 'fastify';

import {AccountModel} from '../models/account/account';


function createAccountController(fastify:FastifyInstance, config:AppConfig): CreateAccountRequestHandler {
    async function create(request:CreateAccountRequest, reply:FastifyReply): Promise<void> {
        const account = new AccountModel(fastify, config);
        const newDoc:AccountDocument = account.createDocument(request.body);

        try {
            const modelResp:ModelCreateDocResponse<AccountDocument> = await account.saveDocument(newDoc);
            if (modelResp.success) {
                reply.code(201).send({
                    account_name: modelResp.document.account_name,
                    account_id: modelResp.document.record_id,
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

function getAccountController(fastify:FastifyInstance, config:AppConfig): GetAccountRequestHandler {
    async function getAccount(request:GetAccountRequest, reply:FastifyReply): Promise<void> {
        const {account_id} = request.params;
        const account = new AccountModel(fastify, config);
        const options:ModelRequestOptions = {
            controlHeader: request.headers['x-control-header'],
        }

        try {
            const modelResp:ModelSearchDocResponse<AccountDocument> = await account.getDocument(
                account_id, options
            );

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
        const options:ModelRequestOptions = {
            controlHeader: request.headers['x-control-header'],
        }

        try {
            const modelResp:ModelDeleteDocResponse<AccountDocument> = await account.removeDocument(
                accountId, options
            );

            if (modelResp.errorMessage.length > 0) {
                reply.code(400).send({error: modelResp.errorMessage});

            } else if (modelResp.success) {
                reply.code(204).send({});

            } else { 
                reply.code(404).send({});
            }

        } catch(error) {
            fastify.log.error(`Cannot remove account: ${error}`);

            reply.code(500).send({
                error: account.getModelResponseError(error),
            });
        }
    }

    return deleteAccount;
}

export {
    createAccountController,
    getAccountController,
    deleteAccountController,
}
