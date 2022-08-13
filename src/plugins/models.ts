import fp from 'fastify-plugin';
import type {FastifyPluginAsync, FastifyInstance} from 'fastify';

import {AccountModel} from '../models/account/account';
import {UserModel} from '../models/user/user';


function createModels(app:FastifyInstance, config:AppConfig) {
    return {
        account: new AccountModel(app, config),
        user: new UserModel(app, config),
    }
}

const registerModels:FastifyPluginAsync<AppConfig> = async (fastify:FastifyInstance, config:AppConfig) => {
    fastify.decorate('models', createModels(fastify, config));
}

export default fp(registerModels);
