import type { FastifyInstance, RouteOptions } from 'fastify';

import {createAccountController, getAccountController, deleteAccountController} from '../controllers/account';
import {
    createAccountRequestValidator, getAccountRequestValidator, removeAccountRequestValidator
} from '../validators/account';


async function createAccountRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        {
            method: 'POST',
            url: '/account/create',
            handler: createAccountController(fastify, config),
            preHandler: createAccountRequestValidator,
            schema: {
                body: {
                    $ref: 'createAccountRequest',
                },
                response: {
                    201: {
                        $ref: 'createAccountResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse',
                    },
                },
            },
        },
        {
            method: 'GET',
            url: '/account/:account_id',
            handler: getAccountController(fastify, config),
            preHandler: getAccountRequestValidator,
            schema: {
                response: {
                    200: {
                        $ref: 'getAccountResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse',
                    },
                },
            },
        },
        {
            method: 'DELETE',
            url: '/account/:account_id',
            handler: deleteAccountController(fastify, config),
            preHandler: removeAccountRequestValidator,
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse',
                    },
                },
            },
        },
    ];

    routes.map((route) => fastify.route(route));
}

export default createAccountRoutes;
