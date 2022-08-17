import * as controllers from '../controllers/transaction';
import * as validators from '../validators/transaction';

import type {FastifyInstance, RouteOptions} from 'fastify';


export default async (fastify:FastifyInstance, _config:AppConfig): Promise<void> => {
    const routes:RouteOptions[] = [
        {
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
            },
        },
        {
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
        },
        {
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
        }
    ];

    routes.map((route) => fastify.route(route));
}
