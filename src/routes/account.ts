import type { FastifyInstance, RouteOptions } from 'fastify';

import {createAccountController, getAccountController, deleteAccountController} from '../controllers/account';


async function createAccountRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        {
            method: 'POST',
            url: '/account/create',
            schema: {
                body: {
                    $ref: 'createAccountRequest',
                },
                response: {
                    201: {
                        $ref: 'createAccountResponse',
                    }
                }
            },
            handler: createAccountController(fastify, config),
        },
        {
            method: 'GET',
            url: '/account/:account_id',
            schema: {
                response: {
                    200: {
                        $ref: 'getAccountResponse',
                    }
                }
            },
            handler: getAccountController(fastify, config),
        },
        {
            method: 'DELETE',
            url: '/account/:account_id',
            handler: deleteAccountController(fastify, config),
        }
    ];

    routes.map((route) => fastify.route(route));
}

export default createAccountRoutes;
