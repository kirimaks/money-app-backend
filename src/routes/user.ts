import type {FastifyInstance, RouteOptions} from 'fastify';

import {newUserController, getUserController, removeUserController} from '../controllers/user';
import {
    createUserRequestValidator, getUserRequestValidator, removeUserRequestValidator
} from '../validators/user';


async function createUserRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const options:RouteOptions[] = [
        {
            method: 'POST',
            url: '/user/create',
            handler: newUserController(fastify, config),
            preHandler: createUserRequestValidator(fastify),
            schema: {
                body: {
                    $ref: 'createUserRequest',
                },
                response: {
                    201: {
                        $ref: 'createUserResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse',
                    },
                },
            },
        },
        {
            method: 'GET',
            url: '/user/:record_id',
            handler: getUserController(fastify, config),
            preHandler: getUserRequestValidator,
            schema: {
                response: {
                    201: {
                        $ref: 'getUserResponse',
                    },
                    400: {
                        $ref: 'badRequestResponse',
                    },
                },
            },
        },
        {
            method: 'DELETE',
            url: '/user/:record_id',
            handler: removeUserController(fastify, config),
            preHandler: removeUserRequestValidator,
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse',
                    },
                },
            },
        },
    ];

    options.map((route) => fastify.route(route));
}

export default createUserRoutes;
