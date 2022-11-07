import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import mercurius from 'mercurius';

import GraphQLSchem from './schema';
import GraphQLResolvers from './resolvers';


interface GraphQLPluginOptions { 
    opt1: string;
}

const GraphQLPlugin: FastifyPluginAsync<GraphQLPluginOptions> = async (fastify, options) => {
    fastify.log.debug(`GraphQL options: ${JSON.stringify(options)}`);

    fastify.register(mercurius, {
        schema: GraphQLSchem,
        resolvers: GraphQLResolvers,
        graphiql: true,
    });
};

export default fp(GraphQLPlugin, '4.x');
