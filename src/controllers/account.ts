import {getErrorMessage, NotFoundError} from '../errors/tools';

import type {HttpError} from '@fastify/sensible/lib/httpError';
import type {FastifyReply, FastifyInstance} from 'fastify';


function createAccountController(fastify:FastifyInstance, _config:AppConfig): CreateAccountRequestHandler {
    async function create(request:CreateAccountRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const account = await fastify.models.account.createDocumentMap(request.body);
            await account.save();

            return reply.code(201).send({
                account_name: account.document.account_name,
                account_id: account.document.account_id,
            });

        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create account: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return create;
}

function getAccountController(fastify:FastifyInstance, _config:AppConfig): GetAccountRequestHandler {
    async function getAccount(request:GetAccountRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const {account_id} = request.params;
            const account = await fastify.models.account.getDocumentMap(account_id);

            return reply.code(200).send({
                account_id: account.document.account_id,
                account_name: account.document.account_name,
                money_sources: account.document.money_sources,
            });

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get account: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return getAccount;
}

function deleteAccountController(fastify:FastifyInstance, _config:AppConfig): DeleteAccountRequestHandler {
    async function deleteAccount(request:DeleteAccountRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const {account_id} = request.params;
            const account = await fastify.models.account.getDocumentMap(account_id);
            await account.delete();

            return reply.code(204).send({});

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);

            fastify.log.error(`Cannot remove account: ${errorMessage}`);
            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }

    return deleteAccount;
}

function createMoneySourceController(fastify:FastifyInstance, _config:AppConfig):CreateMoneySourceRequestHandler {
    return async (request:CreateMoneySourceRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const { account_id } = request.params;
            const { source_name } = request.body;
            const { source_icon } = request.body;

            const updateResp = await fastify.models.account.addMoneySource(account_id, source_name, source_icon);

            return reply.code(201).send({updated: updateResp.updated});

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create source: ${errorMessage}`);
            return fastify.httpErrors.internalServerError();
        }
    }
}

function getAccountDetails(fastify:FastifyInstance): AccountDetailsRequestHandler {
    return async (request:AccountDetailsRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const {account_id} = request.user;
            fastify.log.info(`<<< Account id: ${account_id} >>>`);

            const account = await fastify.models.account.getDocumentMap(account_id);
            fastify.log.info(`<<< Account doc: ${JSON.stringify(account.document)} >>>`);

            return reply.code(200).send({
                account_name: account.document.account_name,
                money_sources: account.document.money_sources,
            });

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get account: ${errorMessage}`);
            return fastify.httpErrors.internalServerError();
        }
    }
}

function createTagController(fastify:FastifyInstance): CreateTagRequestHandler {
    return async (request:CreateTagRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const { account_id } = request.user;
            const { tag_name } = request.body;
            const { tag_icon } = request.body;

            const updateResp = await fastify.models.account.createTag(account_id, tag_name, tag_icon);

            return reply.code(201).send({updated: updateResp.updated});

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create tag: ${errorMessage}`);
            return fastify.httpErrors.internalServerError();
        }
    }
}

export { 
    createAccountController, getAccountController, deleteAccountController, 
    createMoneySourceController, getAccountDetails, createTagController
}
