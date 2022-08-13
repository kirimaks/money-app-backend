import {validate as validateUUID} from 'uuid';

import tap from 'tap';

import {buildApp, getTestAppConfig, generateUser, generateSession} from '../helper';
import {getRandomString} from '../tools';


tap.test('Get by invalid uuid', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/user/hello',
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 400, 'Response for missing user is not 400');
    test.equal(resp.json().message, 'Invalid uuid', 'Wrong error');
});


tap.test('Get missing user', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/user/81e0eae4-95d9-4d27-8be3-eb67f3ccbc3d',
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 404, 'Response for missing user is not 404');
    test.equal(resp.json().error, 'User not found', 'Wrong error');
});

tap.test('Get user and fail', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/user/81e0eae4-95d9-4d27-8be3-eb67f3ccbc3d',
        headers: {
            'X-Control-Header': 'fail500fail',
        },
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 500, 'Response code failed request is not 500');
    test.equal(resp.json().error, 'Cannot get this document', 'Wrong error');
});

tap.test('Remove missing user', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/user/81e0eae4-95d9-4d27-8be3-eb67f3ccbc3d',
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 404, 'Response code for missing user is not 404');
    test.equal(resp.json().error, 'User not found', 'Wrong error');
});

tap.test('Remove user and fail', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/user/81e0eae4-95d9-4d27-8be3-eb67f3ccbc3d',
        headers: {
            'X-Control-Header': 'fail500fail'
        },
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 500, 'Response code for failed request is not 500');
    test.equal(resp.json().error, 'Cannot remove this user', 'Wrong error');
});

tap.test('Create user with wrong/missing account id', async (test) => {
    const newUserDoc = generateUser();
    newUserDoc.account_id = getRandomString(32);

    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 400, 'Response code for bad request is not 400');
});

tap.test('Create user and fail', async (test) => {
    const newUserDoc = generateUser();
    newUserDoc.first_name = 'fail500fail';

    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 500, 'Request fails but response code is not 500');
    test.equal(resp.json().error, 'Cannot create this user', 'Wrong message for failed request');
});

tap.test('Remove user with wrong uuid', async(test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/user/hello',
        cookies: {
            'session-id': session
        }
    });

    test.equal(resp.statusCode, 400, 'Response for invalid uuid is not 400');
    test.equal(resp.json().message, 'Invalid uuid', 'Wrong error');
});

tap.test('Create user', async (createUserTest) => {
    const appConfig = getTestAppConfig();
    const newUserDoc = generateUser();

    const app = await buildApp(createUserTest, appConfig);
    const session = await generateSession(app, appConfig);

    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
        cookies: {
            'session-id': session
        }
    });

    const {record_id} = resp.json();

    createUserTest.equal(resp.statusCode, 201, 'Response for new user is not 201');
    createUserTest.ok(validateUUID(record_id), 'User id is invalid uuid');

    createUserTest.test('Get this user', async (getUserTest) => {
        const resp = await app.inject({
            method: 'GET',
            url: `/user/${record_id}`,
            cookies: {
                'session-id': session
            }
        });

        getUserTest.equal(resp.statusCode, 200, 'User response code is not 200');

        getUserTest.test('Remove this user', async (removeUserTest) => {
            const resp = await app.inject({
                method: 'DELETE',
                url: `/user/${record_id}`,
                cookies: {
                    'session-id': session
                }
            });

            removeUserTest.equal(resp.statusCode, 204, 'Remove user response code is not 204');
        });
    });
});
