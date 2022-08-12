import {UserModel} from './user/user';
import {AccountModel} from './account/account';

import type {FastifyInstance} from 'fastify';


async function removeAutoIndices(fastify:FastifyInstance, config:AppConfig):Promise<void>{
    const user = new UserModel(fastify, config);
    if (user.indexName.startsWith('auto')) {
        fastify.log.debug(`<<< Removing index[user]: ${user.indexName}`);
        await user.deleteIndex();
    }

    const account = new AccountModel(fastify, config);
    if (account.indexName.startsWith('auto')) {
        fastify.log.debug(`<<< Remving index[account]: ${account.indexName}`);
        await account.deleteIndex();
    }
}


export {removeAutoIndices}
