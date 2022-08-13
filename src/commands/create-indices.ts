import Fastify from 'fastify';
import fp from 'fastify-plugin';
import pino from 'pino';

import {app as App} from '../app';
import {getAppConfig} from '../config';
import {AccountModel} from '../models/account/account';
import {UserModel} from '../models/user/user';


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

    const account = new AccountModel(app, config);
    app.log.debug(await account.createIndex());

    const user = new UserModel(app, config);
    app.log.debug(await user.createIndex());
})();
