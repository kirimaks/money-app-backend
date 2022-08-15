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
                        $ref: 'badRequestResponse'
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
