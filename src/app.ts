import { join } from 'path';

import type { FastifyPluginAsync } from 'fastify';
import AutoLoad from '@fastify/autoload';

import {
    validateConfig, getElasticSearchOptions, getSwaggerOptions, 
    getAppConfig, getSessionOptions
} from './config';
import {getSchemas} from './schemas/tools';
import {removeAutoIndices} from './models/tools';


const app: FastifyPluginAsync<AppConfig> = async (fastify, opts): Promise<void> => {
    const config = Object.keys(opts).length ? opts : getAppConfig();
    if (!validateConfig(config)) {
        throw new Error('Invalid config');
    }

    fastify.decorate('config', config);

    for await (const schema of getSchemas()) {
        void fastify.addSchema(schema);
    }

    fastify.register(require('@fastify/elasticsearch'), getElasticSearchOptions(config));
    fastify.register(require('@fastify/swagger'), getSwaggerOptions());
    fastify.register(require('@fastify/secure-session'), getSessionOptions(config));

    fastify.decorateRequest('user', undefined);
    fastify.decorate('removeAutoIndices', async function() {
        await removeAutoIndices(fastify, config);
    });

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application

    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'plugins'),
        options: config
    })

    // This loads all plugins defined in routes
    // define your routes in one of these

    void fastify.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
        options: config
    })
};

export default app;
export { app }
