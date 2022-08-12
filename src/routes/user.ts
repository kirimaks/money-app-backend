import type {FastifyInstance, RouteOptions} from 'fastify';

import {newUserController, getUserController, removeUserController} from '../controllers/user';


async function createUserRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const options:RouteOptions[] = [
        {
            method: 'POST',
            url: '/user/create',
            schema: {
                body: {
                    $ref: 'createUserRequest',
                },
                response: {
                    201: {
                        $ref: 'createUserResponse'
                    }
                }
            },
            handler: newUserController(fastify, config),
        },
        {
            method: 'GET',
            url: '/user/:record_id',
            schema: {
                response: {
                    201: {
                        $ref: 'getUserResponse'
                    }
                }
            },
            handler: getUserController(fastify, config),
        },
        {
            method: 'DELETE',
            url: '/user/:record_id',
            handler: removeUserController(fastify, config)
        }
    ];

    options.map((route) => fastify.route(route));
}

export default createUserRoutes;
