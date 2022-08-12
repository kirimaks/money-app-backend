import {randomBytes} from 'crypto';

import pino from 'pino';
import Fastify from 'fastify'
import fp from 'fastify-plugin';
import {v4 as uuidv4} from 'uuid';

import {app as App} from '../src/app';
import {getAppConfig} from '../src/config';
import {UserModel} from '../src/models/user/user';

import type * as tap from 'tap';
import type {FastifyInstance} from 'fastify';

export type Test = typeof tap['Test']['prototype'];


declare module 'fastify' {
    interface FastifyInstance {
        removeAutoIndices: () => void;
    }
}


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
    t.teardown(async () => { 
        await app.removeAutoIndices();
        await app.close();
    });

    return app
}

function generateUser():UserDraft {
    return {
        first_name: randomBytes(12).toString('hex'),
        last_name: randomBytes(12).toString('hex'),
        phone_number: randomBytes(5).toString('hex'),
        email: randomBytes(10).toString('hex'),
        password: randomBytes(12).toString('hex'),
        account_id: uuidv4(),
        comment: randomBytes(12).toString('hex'),
    }
}

function generateModelIndexName(bytesLength:number) {
    const randomName = randomBytes(bytesLength).toString('hex');
    return `auto-index-${randomName}`;
}

async function generateSession(app:FastifyInstance, appConfig:AppConfig): Promise<string> {
    const userDraft:UserDraft = generateUser();
    const userModel = new UserModel(app, appConfig);

    await userModel.createIndex();

    const signUpResp = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: userDraft
    });

    app.log.debug(`<<< Generate session sing up resp: ${signUpResp.statusCode} >>>`);

    const logInResponse = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
            email: userDraft.email,
            password: userDraft.password,
        }
    });

    app.log.debug(`<<< Generate session log in resp: ${logInResponse.statusCode} >>>`);

    const sessionCookie:Cookie|undefined = (logInResponse.cookies as Cookie[]).find((cookie) => {
        return cookie.name === 'session-id';
    });

    if (sessionCookie) {
        app.log.debug(`Session cookie: ${sessionCookie.value}`);
        return sessionCookie.value;

    } else {
        app.log.error('Cannot generate session, no cookie returned from login.');
    }

    return '';
}

function getTestAppConfig() {
    const appConfig = getAppConfig();

    appConfig.ACCOUNTS_INDEX_NAME = generateModelIndexName(16);
    appConfig.USERS_INDEX_NAME = generateModelIndexName(16);

    return appConfig;
}

export {buildApp, getAppConfig, generateModelIndexName, getTestAppConfig, generateSession, generateUser}
