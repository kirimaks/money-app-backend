import Fastify from 'fastify';
import fp from 'fastify-plugin';
import pino from 'pino';

import {app as App} from '../app';
import {getAppConfig} from '../config';


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

    app.log.debug(await app.models.account.createIndex());
    app.log.debug(await app.models.user.createIndex());
})();
