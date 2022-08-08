import type { FastifyInstance } from 'fastify';

import {createAccountController, getAccountController, deleteAccountController} from '../controllers/account';


class AccountRoutes {
    fastify: FastifyInstance;
    config: AppConfig;

    createAccountController: CreateAccountRequestHandler;
    getAccountController: GetAccountRequestHandler;
    deleteAccountController: DeleteAccountRequestHandler;

    constructor(fastify:FastifyInstance, config:AppConfig) {
        this.fastify = fastify;
        this.config = config;

        this.createAccountController = createAccountController(this.fastify, this.config);
        this.getAccountController = getAccountController(this.fastify, this.config);
        this.deleteAccountController = deleteAccountController(this.fastify, this.config);
    }

    createRoutes():void {
        this.createNewAccountRoute();
        this.createAccountSearchRoute();
        this.createRemoveAccountRoute();
    }

    private createNewAccountRoute() {
        const requestSchema:object = {
            schema: {
                body: {
                    $ref: 'createAccountRequest',
                },
                response: {
                    201: {
                        $ref: 'createAccountResponse',
                    }
                }
            }
        }
        this.fastify.post('/account/create', requestSchema, this.createAccountController);
    }

    private createAccountSearchRoute() {
        const requestSchema = {
            schema: {
                response: {
                    200: {
                        $ref: 'getAccountResponse',
                    }
                }
            }
        }
        this.fastify.get('/account/:account_id', requestSchema, this.getAccountController);
    }

    private createRemoveAccountRoute() {
        const requestSchema = {};
        this.fastify.delete('/account/:account_id', requestSchema, this.deleteAccountController);
    }
}


async function createAccountRoutes(fastify:FastifyInstance, config:AppConfig): Promise<void> {
    const routes = new AccountRoutes(fastify, config);
    routes.createRoutes();
}


export default createAccountRoutes;
