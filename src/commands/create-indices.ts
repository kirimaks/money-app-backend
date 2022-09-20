import Fastify from 'fastify';
import fp from 'fastify-plugin';
import pino from 'pino';

import { errors as elasticErrors } from '@elastic/elasticsearch';

import { app as App } from '../app';
import { getAppConfig } from '../config';
import { IndexExist } from '../errors/exceptions';
import type { ModelCollectionKey } from '../types/models';


async function buildApp(config:AppConfig) {
    const app = Fastify({
        logger: pino({
            level: 'debug',
            transport: {
                target: 'pino-pretty',
                options: {
                    colorize: true,
                },
            }
        }),
    });

    app.register(fp(App), config);
    await app.ready();

    return app;
}


(async () => {
    const config = getAppConfig();
    const app = await buildApp(config);

    (Object.keys(app.models) as ModelCollectionKey[]).map( async(modelName) => {

        try {
            await app.models[modelName].createIndex();

        } catch(error) {
            if (error instanceof IndexExist) {
                app.log.warn(error.message);

            } else if (error instanceof elasticErrors.ResponseError) {
                app.log.error(`Response error: ${error.body}`);

            } else {
                app.log.error(`Cannot create index: ${error}`);
            }
        }
    });
})();
