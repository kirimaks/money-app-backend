import type {FastifyInstance} from 'fastify';


async function removeAutoIndices(fastify:FastifyInstance, _config:AppConfig):Promise<void>{
    if (fastify.models.user.indexName.startsWith('auto')) {
        fastify.log.debug(`<<< Removing index[user]: ${fastify.models.user.indexName}`);
        await fastify.models.user.deleteIndex();
    }

    if (fastify.models.account.indexName.startsWith('auto')) {
        fastify.log.debug(`<<< Remving index[account]: ${fastify.models.account.indexName}`);
        await fastify.models.account.deleteIndex();
    }

    if (fastify.models.transaction.indexName.startsWith('auto')) {
        fastify.log.debug(`<<< Removing index[transaction]: ${fastify.models.transaction.indexName}`);
        await fastify.models.transaction.deleteIndex();
    }

    if (fastify.models.category.indexName.startsWith('auto')) {
        fastify.log.debug(`<<< Removing index[category]: ${fastify.models.category.indexName}`);
        await fastify.models.category.deleteIndex();
    }
}

export {removeAutoIndices}
