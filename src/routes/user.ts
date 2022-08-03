import type {FastifyInstance} from 'fastify';

import {newUserController, getUserController, removeUserController} from '../controllers/user';
import type {NewUserRequestHandler, GetUserRequestHandler, RemoveUserRequestHandler} from '../controllers/user';


class UserRoutes {
    fastify: FastifyInstance;
    config: AppConfig;

    newUserController: NewUserRequestHandler;
    getUserController: GetUserRequestHandler;
    removeUserController: RemoveUserRequestHandler;

    constructor(fastify:FastifyInstance, config:AppConfig) {
        this.fastify = fastify;
        this.config = config;
        this.newUserController = newUserController(this.fastify, this.config);
        this.getUserController = getUserController(this.fastify, this.config);
        this.removeUserController = removeUserController(this.fastify, this.config);
    }

    createNewUserRoute() {
        const requestSchema = {
            schema: {
                body: {
                    $ref: 'createUserRequest',
                },
                response: {
                    201: {
                        $ref: 'createUserResponse'
                    }
                }
            }
        }
        this.fastify.post('/user/create', requestSchema, this.newUserController)
    }

    createGetUserRoute() {
        const requestSchema = {
            schema: {
                response: {
                    201: {
                        $ref: 'getUserResponse'
                    }
                }
            }
        }

        this.fastify.get('/user/:record_id', requestSchema, this.getUserController);
    }

    createRemoveUserRoute() {
        const requestSchema = {};

        this.fastify.delete('/user/:record_id', requestSchema, this.removeUserController);
    }

    createRoutes():void {
        this.createNewUserRoute();
        this.createGetUserRoute();
        this.createRemoveUserRoute();
    }
}

async function createUserRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes = new UserRoutes(fastify, config);
    routes.createRoutes();
}

export default createUserRoutes;
