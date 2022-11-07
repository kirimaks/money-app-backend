import * as dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import FastifyEnv from '@fastify/env';
import cors from '@fastify/cors';

import GraphQLPlugin from './graphql/plugin';

import envOptions from './environment/config';


const fastify = Fastify({
    maxParamLength: 5000,
    logger: {
        transport: {
            target: 'pino-pretty'
        },
        level: process.env.FASTIFY_LOG_LEVEL,
    }
});

fastify.register(cors, {
    origin: ['http://localhost:5173']
});

fastify.register(GraphQLPlugin);

fastify.register(FastifyEnv, envOptions).ready((error) => {
    if (error) {
        fastify.log.error(`Config error: ${error}`);
        process.exit(1);
    }

    const listenOptions = {
        host: fastify.config.FASTIFY_HOST,
        port: fastify.config.FASTIFY_PORT,
    };

    fastify.listen(listenOptions, (error) => {
        if (error) {
            fastify.log.error(`Fastify error: ${error}`);
            process.exit(2);
        }
    });

    fastify.log.debug(fastify.printRoutes());
});
