import { join } from 'path';

import type { FastifyPluginAsync } from 'fastify';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';

import {validateConfig, getElasticSearchOptions, getSwaggerOptions} from './config';
import {getSchemas} from './schemas/tools';


export type AppOptions = {
    // logger: any
} & Partial<AutoloadPluginOptions>;


const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
    if (validateConfig()) {
        fastify.log.info(`<<< Fastify version: ${fastify.version} >>>`);

        for await (const schema of getSchemas()) {
            void fastify.addSchema(schema);
        }

        fastify.register(require('@fastify/elasticsearch'), getElasticSearchOptions());
        fastify.register(require('@fastify/swagger'), getSwaggerOptions());

    } else {
        process.exit(1);
    }
    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application

    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'plugins'),
        options: opts
    })

    // This loads all plugins defined in routes
    // define your routes in one of these

    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
        options: opts
    })
};

export default app;
export { app }
