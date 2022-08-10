import {randomBytes} from 'crypto';
import {v4 as uuidv4} from 'uuid';

import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';
import {UserModel} from '../../src/models/user/user';


function generateUser() {
    return {
        first_name: randomBytes(12).toString('hex'),
        last_name: randomBytes(12).toString('hex'),
        phone_number: randomBytes(10).toString('hex'),
        email: randomBytes(12).toString('hex'),
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

    app.log.debug(resp.json());

    test.equal(resp.statusCode, 200, 'Log in failed');
    test.equal(resp.json().message, 'Logged in, session saved');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp.acknowledged, 'Acknowledged is not true');
});
