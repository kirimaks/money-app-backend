import Fastify from 'fastify';
import FastifyEnv from '@fastify/env';
import cors from '@fastify/cors';
import mercurius from 'mercurius';

import envOptions from './environment/config';

import gqlSchema from './graphql/schema';
import gqlResolvers from './graphql/resolvers';


const fastify = Fastify({
    maxParamLength: 5000,
    logger: {
        transport: {
            target: 'pino-pretty'
        }
    }
});

fastify.register(cors, {
    origin: ['http://localhost:5173']
});

fastify.register(mercurius, { 
    schema: gqlSchema, 
    resolvers: gqlResolvers,
    graphiql: true,
});

fastify.register(FastifyEnv, envOptions).ready((error) => {
    if (error) {
        fastify.log.error(`Env error: ${error.message}`);
        process.exit(1);
    }

    const listenOptions = {
        host: fastify.config.HOST,
        port: fastify.config.PORT,
    };

    fastify.listen(listenOptions, (error, address) => {
        if (error) {
            fastify.log.error(`Fastify error: ${error.message}`);
            process.exit(2);
        }
    });
});
