import {getErrorMessage, NotFoundError} from '../errors/tools';

import type {HttpError} from '@fastify/sensible/lib/httpError';
import type {FastifyInstance, FastifyReply} from 'fastify';


export function createTransactionController(fastify:FastifyInstance): CreateTransactionRequestHandler {
    return async (request:CreateTransactionRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const transactionDraft:TransactionDraft = Object.assign(
                request.body,
                {
                    user_id: request.user.use_id,
                    account_id: request.user.account_id
                }
            );
            const transaction = await fastify.models.transaction.createDocumentMap(transactionDraft);
            await transaction.save();

            return reply.code(201).send({
                transaction_id: transaction.document.transaction_id,
                category_id: transaction.document.category_id,
            });

        } catch(error) {
            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot create transaction: ${errorMessage}`);

            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }
}

export function getTransactionController(fastify:FastifyInstance): GetTransactionRequestHandler {
    return async (request:GetTransactionRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const {transaction_id} = request.params;
            const transaction = await fastify.models.transaction.getDocumentMap(transaction_id);

            return reply.code(200).send({
                transaction_id: transaction.document.transaction_id,
                category_id: transaction.document.category_id,
            });

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get transaction: ${errorMessage}`);

            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }
}

export function deleteTransactionController(fastify:FastifyInstance): DeleteTransactionRequestHandler {
    return async (request:DeleteTransactionRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const {transaction_id} = request.params;
            const transaction = await fastify.models.transaction.getDocumentMap(transaction_id);
            await transaction.delete();

            return reply.code(204).send({});

        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot remove transaction: ${errorMessage}`);

            return fastify.httpErrors.internalServerError(errorMessage);
        }
    }
}

export function latestTransactionsController(fastify:FastifyInstance): LatestTransactionsRequestHandler {
    return async (request:LatestTransactionsRequest, reply:FastifyReply): Promise<HttpError> => {
        try {
            const transactions = await fastify.models.transaction.getRecentTransactions(request.user.account_id);
            
            fastify.log.info(`< Transactions: ${JSON.stringify(transactions)} >`);

            return reply.code(200).send({
                transactions: transactions
            });
            
        } catch(error) {
            if (error instanceof NotFoundError) {
                return fastify.httpErrors.notFound();
            }

            const errorMessage = getErrorMessage(error);
            fastify.log.error(`Cannot get recent transactions: ${errorMessage}`);

            return fastify.httpErrors.internalServerError();
        }
    }
}
