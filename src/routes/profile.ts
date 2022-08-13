import type {FastifyInstance, RouteOptions} from 'fastify';

import {profileController} from '../controllers/profile';


async function profileRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        {
            method: 'GET',
            url: '/profile',
            handler: profileController(fastify, config),
            schema: {
                response: {
                    400: {
                        $ref: 'badRequestResponse'
                    }
                }
            }
        }
    ];

    routes.map((route) => fastify.route(route));
}

export default profileRoutes;
