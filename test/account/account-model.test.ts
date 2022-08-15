import tap from 'tap';

import {buildApp, getTestAppConfig} from '../helper';
import {AccountModel} from '../../src/models/account/account';


tap.test('Create account index', async (test) => {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const account = new AccountModel(app.log, app.elastic, appConfig.ACCOUNTS_INDEX_NAME);

    const createResp = await account.createIndex();

    test.ok(createResp.acknowledged, 'Acknowledged is not true');
    test.equal(createResp.index, account.indexName, 'Index name is not equal');

    const deleteResp = await account.deleteIndex();
    test.ok(deleteResp, 'Acknowledged is not true');
});