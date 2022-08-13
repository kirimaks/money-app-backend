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
}

export {removeAutoIndices}
