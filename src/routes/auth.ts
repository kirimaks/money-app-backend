import type {FastifyRequest, FastifyReply, FastifyInstance, RouteOptions} from 'fastify';

import {logInController, signUpController} from '../controllers/auth';


function emptyPreHandler(_request:FastifyRequest, _reply:FastifyReply, done: () => void) {
    done();
}

async function createAuthRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes:RouteOptions[] = [
        {
            method: 'POST',
            url: '/auth/signup',
            schema: {
                body: {
                    $ref: 'createUserRequest'
                },
                response: {
                    400: {
                        $ref: 'signUpErrorResponse'
                    }
                },
            },
            preHandler: emptyPreHandler,
            handler: signUpController(fastify, config),
        },
        {
            method: 'POST', 
            url: '/auth/login', 
            schema: {
                body: { $ref: 'logInRequest'
                },
                response: {
                    400: {
                        $ref: 'logInErrorResponse'
                    },
                }
            },
            preHandler: emptyPreHandler,
            handler: logInController(fastify, config),
        }
    ];

    routes.map((route) => fastify.route(route));
}

export default createAuthRoutes;
