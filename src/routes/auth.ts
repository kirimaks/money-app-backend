import type {FastifyInstance} from 'fastify';

import {logInController, signUpController} from '../controllers/auth';


class AuthRoutes {
    fastify: FastifyInstance;
    config: AppConfig;

    logInController: LogInRequestHandler;
    signUpController: SignUpRequestHandler;

    constructor(fastify:FastifyInstance, config:AppConfig) {
        this.fastify = fastify;
        this.config = config;

        this.logInController = logInController(this.fastify, this.config);
        this.signUpController = signUpController(this.fastify, this.config);
    }

    createRoutes():void {
        this.createLogInRoute();
        this.createSignUpRoute();
    }

    private createLogInRoute() {
        const requestSchema = {
            schema: {
                body: {
                    $ref: 'logInRequest'
                },
                response: {
                    400: {
                        $ref: 'logInErrorResponse'
                    },
                }
            }
        }

        this.fastify.post('/auth/login', requestSchema, this.logInController);
    }

    private createSignUpRoute() {
        const requestSchema = {
            schema: {
                body: {
                    $ref: 'createUserRequest',
                },
                response: {
                    400: {
                        $ref: 'signUpErrorResponse'
                    },
                }
            }
        };

        this.fastify.post('/auth/signup', requestSchema, this.signUpController);
    }
}

async function createAuthRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes = new AuthRoutes(fastify, config);
    routes.createRoutes();
}

export default createAuthRoutes;
