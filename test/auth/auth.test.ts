import {randomBytes} from 'crypto';
import {v4 as uuidv4} from 'uuid';

import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';
import {UserModel} from '../../src/models/user/user';


function generateUser() {
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


tap.test('Test password hashing', async (test) => {
    const appConfig = getAppConfig();

    const app = await buildApp(test, appConfig);
    const user = new UserModel(app, appConfig);

    const indexResp = await user.createIndex();
    test.ok(indexResp.acknowledged, 'Acknowledged is not true');

    const userDraft:UserDraft = generateUser();
    const docResp = await user.createDocument(userDraft);

    test.ok(docResp.password.hash, 'Hash is null');
    test.ok(docResp.password.salt, 'Salt is null');

    const savingResp = await user.saveDocument(docResp);

    if (!savingResp.success) {
        app.log.error(savingResp);
    }

    test.ok(savingResp.success, 'Response is not successful');

    const invalidSession = await user.verifyPassword(userDraft.email, randomBytes(8).toString('hex'));
    const validSession = await user.verifyPassword(userDraft.email, userDraft.password);

    test.ok(invalidSession.anonymous, 'Password is not invalid');
    test.notOk(invalidSession.user_id, 'User id is not empty');
    test.notOk(invalidSession.account_id, 'Account id is not empty');

    test.notOk(validSession.anonymous, 'Password is invalid');
    test.equal(validSession.user_id, docResp.record_id, 'Wrong user id');
    test.equal(validSession.account_id, docResp.account_id, 'Wrong account id');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp.acknowledged, 'Acknowledged is not true');
});

tap.test('Log in controller', async(test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);

    const user = new UserModel(app, appConfig);
    const indexResp = await user.createIndex();
    test.ok(indexResp.acknowledged, 'Acknowledged is not true');

    const userDraft:UserDraft = generateUser();
    const docResp = await user.createDocument(userDraft);
    const savingResp = await user.saveDocument(docResp);

    if (!savingResp.success) {
        app.log.error(savingResp);
    }

    test.ok(savingResp.success, 'Response is not successful');

    const resp = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
            email: userDraft.email,
            password: userDraft.password,
        },
    });

    test.equal(resp.statusCode, 200, 'Log in failed');
    test.equal(resp.json().message, 'Logged in, session saved', 'Wrong message');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp.acknowledged, 'Acknowledged is not true');
});

tap.test('Create user and log in', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);

    const user = new UserModel(app, appConfig);
    const indexResp = await user.createIndex();
    test.ok(indexResp.acknowledged, 'Acknowledged is not true');

    const userDraft:UserDraft = generateUser();

    const signUpResp = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: userDraft
    });

    test.equal(signUpResp.statusCode, 201, 'Signup response is not 201');
    test.equal(signUpResp.json().message, 'User created', 'Wrong message');

    const logInResp = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
            email: userDraft.email,
            password: userDraft.password
        }
    });

    test.equal(logInResp.statusCode, 200, 'Log in response is not 200');
    test.equal(logInResp.json().message, 'Logged in, session saved', 'Wrong message');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp.acknowledged, 'Acknowledged is not true');
});
