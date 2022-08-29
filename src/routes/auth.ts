import { logInController, signUpController, logOutController } from '../controllers/auth';
import { signUpRequestValidator } from '../validators/signup';

import type { FastifyInstance, RouteOptions } from 'fastify';


async function createAuthRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        {
            method: 'POST',
            url: '/auth/signup',
            handler: signUpController(fastify, config),
            preHandler: signUpRequestValidator(fastify),
            schema: {
                body: {
                    $ref: 'signUpRequest',
                },
                response: {
                    400: {
                        $ref: 'badRequestResponse',
                    },
                    201: {
                        $ref: 'signUpOkResponse',
                    }
                },
            },
        },
        {
            method: 'POST', 
            url: '/auth/login', 
            schema: {
                body: { 
                    $ref: 'logInRequest'
                },
                response: {
                    400: {
                        $ref: 'badRequestResponse'
                    },
                }
            },
            handler: logInController(fastify, config),
        },
        {
            method: 'GET',
            url: '/auth/logout',
            handler: logOutController(fastify),
        }
    ];

    routes.map((route) => fastify.route(route));
}

export default createAuthRoutes;
