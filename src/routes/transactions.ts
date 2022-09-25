import * as controllers from '../controllers/transaction';
import * as validators from '../validators/transaction';

import type { FastifyInstance } from 'fastify';


export default async (fastify:FastifyInstance, _config:AppConfig): Promise<void> => {
    fastify.route({
        method: 'POST',
        url: '/transactions/new-transaction',
        preHandler: validators.createTransactionRequestValidator(fastify),
        handler: controllers.createTransactionController(fastify),
        schema: {
            body: {
                $ref: 'transactionRequest',
            },
            response: {
                400: {
                    $ref: 'badRequestResponse',
                },
                201: {
                    $ref: 'transactionResponse',
                },
            },
        }
    });

    fastify.route({
        method: 'GET',
        url: '/transactions/:transaction_id',
        preHandler: validators.getTransactionRequestValidator(fastify),
        handler: controllers.getTransactionController(fastify),
        schema: {
            response: {
                400: {
                    $ref: 'badRequestResponse',
                },
                201: { /* TODO: wrong code */
                    $ref: 'transactionResponse',
                }
            }
        }
    });

    fastify.route({
        method: 'DELETE',
        url: '/transactions/:transaction_id',
        handler: controllers.deleteTransactionController(fastify),
        schema: {
            response: {
                400: {
                    $ref: 'badRequestResponse',
                },
            }
        }
    });

    fastify.route({
        method: 'GET',
        url: '/transactions/latest',
        handler: controllers.latestTransactionsController(fastify),
        schema: {
            response: {
                200: {
                    $ref: 'latestTransactionsResponse',
                },
                400: {
                    $ref: 'badRequestResponse',
                }
            }
        }
    });

    fastify.route({
        method: 'GET',
        url: '/transactions/recent',
        handler: controllers.recentTransactionsConttoller(fastify),
    });
}
