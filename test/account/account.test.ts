import {randomBytes} from 'crypto';
import tap from 'tap';

import {build} from '../helper';
import {ACCOUNT_NAME_MIN_LENGTH, ACCOUNT_NAME_MAX_LENGTH} from '../../src/schemas/account';


const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';


function getRandomString(length:number):string {
    return randomBytes(length/2).toString('hex');
}


type SchemaType = {
    properties: string[];
};

tap.test('Query non existing account', async(test) => {
    const app = await build(test);
    const resp = await app.inject({
        method: 'GET',
        url: '/account/1234',
    });

    test.equal(resp.statusCode, 404, 'Query for missing account, response is not 404');
});

tap.test('Remove non existing account', async(test) => {
    const app = await build(test);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/account/1234',
    });

    test.equal(resp.statusCode, 404, 'Removing missing account response is not 404');
});


tap.test('Account no name validation', async (test) => {
    const app = await build(test);
    const resp = await app.inject({
        method: 'POST',
        url: '/account/create',
        payload: {
            x: getRandomString(16),
        }
    });
    test.equal(resp.statusCode, 400, 'Cannot create account without name');
    test.equal(
        resp.json().message, "body must have required property 'account_name'", 'Account Name validation fails'
    );
});

tap.test('Account short name validation', async (test) => {
    const app = await build(test);
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
    const app = await build(test);
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
    const app = await build(createAccountTest);
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

            /*
            removeAccountTest.test('Query removed account', async (queryRemovedAccountTest) => {
                const resp = await app.inject({
                    method: 'GET',
                    url: `/account/${accountId}`,
                });

                queryRemovedAccountTest.equal(resp.statusCode, 404, 'Account removed but response code is not 404');
            });
            */
        });
    });
});
