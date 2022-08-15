import {getErrorMessage, NotFoundError} from '../errors/tools';
import {
    CreateAccountValidator, GetAccountRequestValidator, RemoveAccountRequestValidator
} from '../validators/account';

import type {HttpError} from '@fastify/sensible/lib/httpError';
import type {FastifyReply, FastifyInstance} from 'fastify';


function createAccountController(fastify:FastifyInstance, _config:AppConfig): CreateAccountRequestHandler {
    async function create(request:CreateAccountRequest, reply:FastifyReply): Promise<HttpError> {
        try {
            const validator = new CreateAccountValidator(request.body);

            if (await validator.isValid()) {
                const account = await fastify.models.account.createDocumentMap(request.body);
                await account.save();

                return reply.code(201).send({
                    account_name: account.document.account_name,
                    account_id: account.document.account_id,
                });
            }
            return fastify.httpErrors.badRequest(validator.errorMessage);

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
            const validator = new GetAccountRequestValidator(request.params);

            if (await validator.isValid()) {
                const {account_id} = request.params;
                const account = await fastify.models.account.getDocumentMap(account_id);
                return reply.code(200).send({
                    account_name: account.document.account_name
                });
            }
            return fastify.httpErrors.badRequest(validator.errorMessage);

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
            const validator = new RemoveAccountRequestValidator(request.params);

            if (await validator.isValid()) {
                const accountId = request.params.account_id;
                const account = await fastify.models.account.getDocumentMap(accountId);
                await account.delete();
                return reply.code(204).send({});
            }

            return fastify.httpErrors.badRequest(validator.errorMessage);

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
