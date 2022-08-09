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

    const verifyWrongPassword = await user.verifyPassword(userDraft.email, randomBytes(8).toString('hex'));
    const verifyCorrectPassword = await user.verifyPassword(userDraft.email, userDraft.password);

    test.notOk(verifyWrongPassword, 'Password is invalid');
    test.ok(verifyCorrectPassword, 'Password is invalid');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp.acknowledged, 'Acknowledged is not true');
});
