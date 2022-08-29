import type {FastifyInstance, RouteOptions} from 'fastify';

import {profileController, profileUpdateController} from '../controllers/profile';


async function profileRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        {
            method: 'GET',
            url: '/profile',
            handler: profileController(fastify, config),
            schema: {
                response: {
                    200: {
                        $ref: 'profileReponse',
                    },
                    400: {
                        $ref: 'badRequestResponse'
                    }
                }
            }
        },
        {
            method: 'PATCH',
            url: '/profile/update',
            handler: profileUpdateController(fastify, config),
            schema: {
                response: {
                    200: {
                        $ref: 'profileReponse',
                    },
                    400: {
                        $ref: 'badRequestResponse'
                    }
                },
            }
        }
    ];

    routes.map((route) => fastify.route(route));
}

export default profileRoutes;
