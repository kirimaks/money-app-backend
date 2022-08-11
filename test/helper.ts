import Fastify from 'fastify'
import pino from 'pino';
import {randomBytes} from 'crypto';

import fp from 'fastify-plugin';
import {app as App} from '../src/app';
import {getAppConfig} from '../src/config';

import type * as tap from 'tap';

export type Test = typeof tap['Test']['prototype'];


async function buildApp (t: Test, config:AppConfig) {
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

    // fastify-plugin ensures that all decorators
    // are exposed for testing purposes, this is
    // different from the production setup
    // void app.register(fp(App), await config())
    void app.register(fp(App), config)

    await app.ready();

    // Tear down our app after we are done
    t.teardown(() => void app.close())

    return app
}

function generateModelIndexName() {
    const randomName = randomBytes(8).toString('hex');
    return `auto-index-${randomName}`;
}

export {buildApp, getAppConfig, generateModelIndexName}
