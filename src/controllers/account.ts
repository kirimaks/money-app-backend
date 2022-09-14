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

export {createAccountController, getAccountController, deleteAccountController}
