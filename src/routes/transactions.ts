/* TODO: refactor imports */
import {createTransactionController, getTransactionController, deleteTransactionController} from '../controllers/transaction';
import {createTransactionRequestValidator, getTransactionRequestValidator} from '../validators/transaction';

import type {FastifyInstance, RouteOptions} from 'fastify';


export default async (fastify:FastifyInstance, _config:AppConfig): Promise<void> => {
    const routes:RouteOptions[] = [
        {
            method: 'POST',
            url: '/transactions/new-transaction',
            preHandler: createTransactionRequestValidator(fastify),
            handler: createTransactionController(fastify),
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
            },
        },
        {
            method: 'GET',
            url: '/transactions/:transaction_id',
            preHandler: getTransactionRequestValidator(fastify),
            handler: getTransactionController(fastify),
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse',
                    },
                    201: {
                        $ref: 'transactionResponse',
                    }
                }
            }
        },
        {
            method: 'DELETE',
            url: '/transactions/:transaction_id',
            handler: deleteTransactionController(fastify),
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse',
                    },
                }
            }
        }
    ];

    routes.map((route) => fastify.route(route));
}
