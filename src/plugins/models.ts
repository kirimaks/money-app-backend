import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyInstance } from 'fastify';

import { AccountModel } from '../models/account/account';
import { UserModel } from '../models/user/user';
import { TransactionModel } from '../models/transaction/transaction';
import { CategoryModel } from '../models/category/category';
import { RequestMetricsModel } from '../models/metrics/request-metrics';
import type { ModelsCollection } from '../types/models';


function createModels(app:FastifyInstance, config:AppConfig):ModelsCollection {
    return {
        account: new AccountModel(app.log, app.elastic, config.ACCOUNTS_INDEX_NAME),
        user: new UserModel(app.log, app.elastic, config.USERS_INDEX_NAME),
        transaction: new TransactionModel(app.log, app.elastic, config.TRANSACTIONS_INDEX_NAME),
        category: new CategoryModel(app.log, app.elastic, config.CATEGORIES_INDEX_NAME),
        requestMetricsModel: new RequestMetricsModel(app.log, app.elastic, config.REQUEST_METRICS_INDEX_NAME),
    }
}

const registerModels:FastifyPluginAsync<AppConfig> = async (fastify:FastifyInstance, config:AppConfig) => {
    fastify.decorate('models', createModels(fastify, config));
}

export default fp(registerModels);
