import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';
import {getErrorMessage} from '../../src/errors/tools';
import {AccountModel} from '../../src/models/account/account';


tap.test('Test regular error handler', async (test) => {
    try {
        throw new Error('Some error');

    } catch(error) {
        test.equal(getErrorMessage(error), 'Some error', 'Wrong error');
    }

    try {
        throw 'some error';
    } catch(error) {
        test.equal(getErrorMessage(error), 'Error message is not provided', 'Wrong error');
    }
});

tap.test('Test model error handler', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const account = new AccountModel(app.log, app.elastic, appConfig.ACCOUNTS_INDEX_NAME);

    try {
        throw new Error('Some error');

    } catch(error) {
        test.equal(account.getModelResponseError(error), 'Some error', 'Wrong error');
    }

    try {
        throw 'Some error'
    } catch(error) {
        test.equal(account.getModelResponseError(error), 'Cannot parse error message', 'Wrong error');
    }
});
