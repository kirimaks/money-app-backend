import {validate as validateUUID, v4 as uuidv4} from 'uuid';

import tap from 'tap';

import {buildApp, getTestAppConfig, generateUser, generateSession} from '../helper';


tap.test('Get by invalid uuid', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'GET',
        url: '/user/hello',
        cookies: {
            'session-id': session.cookie
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
            'session-id': session.cookie
        }
    });

    test.equal(resp.statusCode, 404, 'Response for missing user is not 404');
    test.equal(resp.json().error, 'Not Found', 'Wrong error');
});

tap.test('Remove missing user', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/user/81e0eae4-95d9-4d27-8be3-eb67f3ccbc3d',
        cookies: {
            'session-id': session.cookie
        }
    });

    test.equal(resp.statusCode, 404, 'Response code for missing user is not 404');
    test.equal(resp.json().error, 'Not Found', 'Wrong error');
});

tap.test('Create user and fail', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    const newUserDoc = generateUser();
    newUserDoc.account_id = session.account_id;
    newUserDoc.first_name = 'fail500fail';

    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
        cookies: {
            'session-id': session.cookie
        }
    });

    app.log.info(`New user resp: ${JSON.stringify(resp.json())}`);

    test.equal(resp.statusCode, 500, 'Request fails but response code is not 500');
    test.equal(resp.json().error, 'Internal Server Error', 'Wrong message for failed request');
});

tap.test('Remove user with wrong uuid', async(test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);
    const resp = await app.inject({
        method: 'DELETE',
        url: '/user/hello',
        cookies: {
            'session-id': session.cookie
        }
    });

    test.equal(resp.statusCode, 400, 'Response for invalid uuid is not 400');
    test.equal(resp.json().message, 'Invalid uuid', 'Wrong error');
});

tap.test('Create user', async (createUserTest) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(createUserTest, appConfig);
    const session = await generateSession(app, appConfig);

    const newUserDoc = generateUser();
    newUserDoc.account_id = session.account_id;

    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
        cookies: {
            'session-id': session.cookie
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
                'session-id': session.cookie
            }
        });

        getUserTest.equal(resp.statusCode, 200, 'User response code is not 200');

        getUserTest.test('Remove this user', async (removeUserTest) => {
            const resp = await app.inject({
                method: 'DELETE',
                url: `/user/${record_id}`,
                cookies: {
                    'session-id': session.cookie
                }
            });

            removeUserTest.equal(resp.statusCode, 204, 'Remove user response code is not 204');
        });
    });
});

tap.test('Create user with missing account', async (test) => {
    const appConfig = getTestAppConfig();
    const randomAccountId = uuidv4();
    const newUserDoc = generateUser();
    newUserDoc.account_id = randomAccountId;

    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    const resp = await app.inject({
        method: 'POST',
        url: '/user/create',
        payload: newUserDoc,
        cookies: {
            'session-id': session.cookie
        }
    });

    test.equal(resp.statusCode, 400, 'Status code for bad response is not 400');
    test.equal(resp.json().message, `No such account: ${randomAccountId}`, 'Wrong error message');
});
