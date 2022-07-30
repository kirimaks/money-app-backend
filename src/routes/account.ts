import type { FastifyInstance } from 'fastify';

import {createAccountController, getAccountController, deleteAccountController} from '../controllers/account';
import type { 
    CreateAccountRequestHandler, SearchAccountRequestHandler, DeleteAccountRequestHandler 
} from '../controllers/account';


class AccountRoutes {
    fastify: FastifyInstance;
    opts: object;

    createAccountController: CreateAccountRequestHandler;
    getAccountController: SearchAccountRequestHandler;
    deleteAccountController: DeleteAccountRequestHandler;

    constructor(fastify:FastifyInstance, opts:object) {
        this.fastify = fastify;
        this.opts = opts;

        this.getAccountController = getAccountController(this.fastify);
        this.createAccountController = createAccountController(this.fastify);
        this.deleteAccountController = deleteAccountController(this.fastify);

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


async function createAccountRoutes(fastify:FastifyInstance, opts:object): Promise<void> {
    new AccountRoutes(fastify, opts);
}


export default createAccountRoutes;
