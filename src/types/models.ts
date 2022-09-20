import type { Client as ESClient } from '@elastic/elasticsearch';

import type { AccountModel } from '../models/account/account';
import type { UserModel } from '../models/user/user';
import type { TransactionModel } from '../models/transaction/transaction';
import type { CategoryModel } from '../models/category/category';
import type { RequestMetricsModel } from '../models/metrics/request-metrics';


interface ModelsCollection {
    account: AccountModel;
    user: UserModel;
    transaction: TransactionModel;
    category: CategoryModel;
    requestMetricsModel: RequestMetricsModel;
}

type ModelCollectionKey = keyof ModelsCollection;

declare module 'fastify' {
    interface FastifyInstance {
        elastic: ESClient;
        models: ModelsCollection;
    }
}

export { ModelsCollection, ModelCollectionKey }
