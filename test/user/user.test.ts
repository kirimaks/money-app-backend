import {v4 as uuidv4, validate as validateUUID} from 'uuid';

import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';
import {getRandomString} from '../tools';


function generateNewUserDoc():UserDraft {
    return {
        first_name: getRandomString(12),
        last_name: getRandomString(12),
        phone_number: getRandomString(10),
        email: getRandomString(12),
        password: getRandomString(12),
        account_id: uuidv4(),
        comment: getRandomString(12),
    }
}


tap.test('Get missing user', async (test) => {
    const appConfig = getAppConfig();

    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/user/hello',
    });

    console.log('Get missing user: ', resp.json());

    test.equal(resp.statusCode, 404, 'Response for missing user is not 404');
});

tap.test('Create user with wrong/missing account id', async (test) => {
    const newUserDoc = generateNewUserDoc();
    newUserDoc.account_id = getRandomString(32);

    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
    });

    test.equal(resp.statusCode, 400, 'Response code for bad request is not 400');
});

tap.test('Create user and fail', async (test) => {
    const newUserDoc = generateNewUserDoc();
    newUserDoc.first_name = 'failfailfail';

    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
    });

    test.equal(resp.statusCode, 500, 'Request fails but response code is not 500');
    test.equal(resp.json().error, 'Cannot create this user', 'Wrong message for failed request');
});

tap.test('Create user', async (createUserTest) => {
    const appConfig = getAppConfig();
    const newUserDoc = generateNewUserDoc();

    const app = await buildApp(createUserTest, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
    });
    console.log(resp.json());

    const {record_id} = resp.json();

    console.log('User ID: ', record_id);

    createUserTest.equal(resp.statusCode, 201, 'Response for new user is not 201');
    createUserTest.ok(validateUUID(record_id), 'User id is invalid uuid');

    createUserTest.test('Get this user', async (getUserTest) => {
        console.log('User id: ', record_id);

        const resp = await app.inject({
            method: 'GET',
            url: `/user/${record_id}`,
        });

        console.log('Get this user: ', resp.json());

        getUserTest.equal(resp.statusCode, 200, 'User response code is not 200');

        getUserTest.test('Remove this user', async (removeUserTest) => {
            const resp = await app.inject({
                method: 'DELETE',
                url: `/user/${record_id}`,
            });

            removeUserTest.equal(resp.statusCode, 204, 'Remove user response code is not 204');
        });
    });
});
