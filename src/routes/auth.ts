import type {FastifyInstance} from 'fastify';

import {logInController} from '../controllers/auth';


class AuthRoutes {
    fastify: FastifyInstance;
    config: AppConfig;

    logInController: LogInRequestHandler;

    constructor(fastify:FastifyInstance, config:AppConfig) {
        this.fastify = fastify;
        this.config = config;

        this.logInController = logInController(this.fastify, this.config);
    }

    createRoutes():void {
        this.createLogInRoute();
    }

    private createLogInRoute() {
        const requestSchema = {
            schema: {
                body: {
                    $ref: 'logInRequest'
                },
                response: {
                    200: {
                        $ref: 'logInOkResponse'
                    },
                    400: {
                        $ref: 'logInErrorResponse'
                    },
                }
            }
        }

        this.fastify.post('/auth/login', requestSchema, this.logInController);
    }
}

async function createAuthRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes = new AuthRoutes(fastify, config);
    routes.createRoutes();
}

export default createAuthRoutes;
