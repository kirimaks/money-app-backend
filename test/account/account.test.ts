import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';
import {ACCOUNT_NAME_MIN_LENGTH, ACCOUNT_NAME_MAX_LENGTH} from '../../src/schemas/account';
import {getRandomString} from '../tools';


const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';




type SchemaType = {
    properties: string[];
};


tap.test('Get account by invalid uuid', async (test) => {
    const appConfig = getAppConfig();
    appConfig.ACCOUNTS_INDEX_NAME = 'wrong.wrong';

    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/account/hello',
    });

    test.equal(resp.statusCode, 400, 'Query by wrong uuid returns not 400');
    test.equal(resp.json().error, 'Invalid uuid', 'Wrong error message');
});

tap.test('Query non existing account', async(test) => {
    const appConfig = getAppConfig();

    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/account/da785790-e7d2-45d0-8a76-0ccfb31948f4',
    });

    test.equal(resp.statusCode, 404, 'Query for missing account, response is not 404');
});

tap.test('Fail on account creation', async(test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            account_name: 'fail500fail'
        }
    });
    test.equal(resp.statusCode, 500, 'Account creation fails but response is no 500');
    test.equal(resp.json().error, 'Account creation failed', 'Returns wrong error');
});

tap.test('Create account with bad characters', async(test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            account_name: 'failfailfail,.'
        }
    });
    test.equal(resp.statusCode, 400, 'Account creation fails but response is no 400');
    test.equal(resp.json().error, 'Bad characters in account name', 'Wrong error returned');
});

tap.test('Remove non existing account', async(test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/account/da785790-e7d2-45d0-8a76-0ccfb31948f4',
    });

    test.equal(resp.statusCode, 404, 'Removing missing account response is not 404');
});

tap.test('Search for an account and fail', async(test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/account/da785790-e7d2-45d0-8a76-0ccfb31948f4',
        headers: {
            'X-Control-Header': 'fail500fail'
        }
    });

    test.equal(resp.statusCode, 500, 'Response code for failed request is not 500');
    test.equal(resp.json().error, 'Cannot create this account', 'Wrong error');
});

tap.test('Fail on account remove', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/account/da785790-e7d2-45d0-8a76-0ccfb31948f4',
        headers: {
            'X-Control-Header': 'fail500fail'
        }
    });

    test.equal(resp.statusCode, 500, 'Account deletion fails but response is not 500');
    test.equal(resp.json().error, 'Cannot remove this account', 'Error message not match');
});

tap.test('Remove account by wrong uuid', async(test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/account/wrong-uuid',
    });

    test.equal(resp.statusCode, 400, 'Account deletion fails but response is not 400');
    test.equal(resp.json().error, 'Invalid uuid', 'Error message not match');
});

tap.test('Account no name validation', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            x: getRandomString(16),
        }
    });
    test.equal(resp.statusCode, 400, 'Cannot create account without name');
    test.equal(
        resp.json().message, "body must have required property 'account_name'", 'Wrong error text'
    );
});

tap.test('Account short name validation', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp= await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            account_name: getRandomString(2),
        }
    });
    test.equal(resp.statusCode, 400, 'Account crated with too short name');
    test.equal(
        resp.json().message, 
        `body/account_name must NOT have fewer than ${ACCOUNT_NAME_MIN_LENGTH} characters`,
        'Account name lenght (min) validation fails'
    );
});

tap.test('Account long name validation', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            account_name: getRandomString(256),
        }
    });
    test.equal(resp.statusCode, 400, 'Account created with too long name');
    test.equal(
        resp.json().message,
        `body/account_name must NOT have more than ${ACCOUNT_NAME_MAX_LENGTH} characters`,
        'Account name lenght (max) validation fails'
    );
});

tap.test('Create account', async (createAccountTest) => {
    const appConfig = getAppConfig();
    const app = await buildApp(createAccountTest, appConfig);
    const accountName:string = getRandomString(16);
    const respSchema:SchemaType = app.getSchema('createAccountResponse') as SchemaType;
    const respProps:string[] = Object.keys(respSchema.properties);

    const response = await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            account_name: accountName,
        }
    });
    const accountId:string = response.json().account_id;

    createAccountTest.ok(accountId, 'New account id is null');
    createAccountTest.ok(response.json().account_name, 'New account name is null');
    createAccountTest.equal(accountName, response.json().account_name, 'New account name is wrong');

    createAccountTest.equal(response.statusCode, 201, 'POST /account/create: response is not 201');
    createAccountTest.equal(
        response.headers['content-type'], JSON_CONTENT_TYPE, 'POST /account/create: wrong content type'
    );
    createAccountTest.same(
        Object.keys(response.json()), respProps, 'POST /account/create: response schema is broken'
    );

    createAccountTest.test('Query account', async (queryAccountTest) => {
        const response = await app.inject({
            method: 'GET',
            url: `/account/${accountId}`,
        });

        queryAccountTest.equal(response.statusCode, 200, 'Cannot find new account, response is not 200');
        queryAccountTest.equal(response.headers['content-type'], JSON_CONTENT_TYPE);

        queryAccountTest.test('Remove account', async (removeAccountTest) => {
            const response = await app.inject({
                method: 'DELETE',
                url: `/account/${accountId}`,
            });

            removeAccountTest.equal(response.statusCode, 204, 'Cannot remove account, response is not 204');
            removeAccountTest.equal(response.headers['content-type'], JSON_CONTENT_TYPE);
        });
    });
});
