import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';
import {AccountModel} from '../../src/models/account/account';


tap.test('Create account index', async (test) => {
    const appConfig = getAppConfig();

    const app = await buildApp(test, appConfig);
    const account = new AccountModel(app, appConfig);

    const createResp = await account.createIndex();

    test.ok(createResp.acknowledged, 'Acknowledged is not true');
    test.equal(createResp.index, account.indexName, 'Index name is not equal');

    const deleteResp = await account.deleteIndex();
    test.ok(deleteResp.acknowledged, 'Acknowledged is not true');
});
