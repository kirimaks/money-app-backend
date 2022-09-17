import type { FastifyInstance, RouteOptions } from 'fastify';

import { 
    createAccountController, getAccountController, deleteAccountController, 
    createMoneySourceController, getAccountDetails, createTagController
} from '../controllers/account';

import {
    createAccountRequestValidator, getAccountRequestValidator, removeAccountRequestValidator
} from '../validators/account';


async function createAccountRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        { 
            method: 'POST', // TODO: remove
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
            method: 'GET', // TODO: remove id
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
            method: 'DELETE', // TODO: remove
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
        { 
            method: 'PUT', // TODO: remove id
            url: '/account/:account_id/create-money-source',
            handler: createMoneySourceController(fastify, config),
            // preHandler: createMoneySourceRequestValidator,
            schema: {
                response: {
                    201: {
                        $ref: 'createMoneySourceResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse',
                    },
                }
            }
        },
        {
            method: 'GET',
            url: '/account',
            handler: getAccountDetails(fastify),
            schema: {
                response: {
                    200: {
                        $ref: 'accountDetailsResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse'
                    }
                }
            }
        },
        {
            method: 'PUT',
            url: '/account/create-tag',
            handler: createTagController(fastify),
            schema: {
                response: {
                    201: {
                        $ref: 'createTagResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse',
                    }
                }
            }
        }
    ];

    routes.map((route) => fastify.route(route));
}

export default createAccountRoutes;
