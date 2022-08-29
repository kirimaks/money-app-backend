import crypto from 'crypto';

import tap from 'tap';

import {buildApp, getAppConfig, generateSession, getTestAppConfig} from '../helper';


tap.test('Cannot access to profile without session', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);

    const resp = await app.inject({
        method: 'GET',
        url: '/profile',
    });

    test.equal(resp.statusCode, 401, 'Unauthorized response code is not 401');
});

tap.test('Create session and update profile', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);

    const session = await generateSession(app, appConfig);

    const resp = await app.inject({
        method: 'GET',
        url: '/profile',
        cookies: {
            'session-id': session.cookie,
        }
    });

    test.equal(resp.statusCode, 200, 'Profile response is not 200');

    test.test('Update profile', async (updateProfileTest) => {
        const newFirstName = crypto.randomBytes(8).toString('hex');
        const newLastName = crypto.randomBytes(8).toString('hex');

        const updateResp = await app.inject({
            method: 'PATCH',
            url: '/profile/update',
            payload: {
                first_name: newFirstName,
                last_name: newLastName,
            },
            cookies: {
                'session-id': session.cookie,
            }
        });

        updateProfileTest.equal(updateResp.statusCode, 200, 'Update profile response is not 200');
        updateProfileTest.test('Check updated profile', async (confirmUpdateTest) => {
            const newProfileResp = await app.inject({
                method: 'GET',
                url: '/profile',
                cookies: {
                    'session-id': session.cookie,
                }
            });

            confirmUpdateTest.equal(newProfileResp.statusCode, 200, 'Profile response is not 200');

            confirmUpdateTest.equal(newProfileResp.json().first_name, newFirstName, 'Wrong first name');
            confirmUpdateTest.equal(newProfileResp.json().last_name, newLastName, 'Wrong last name');
        });
    });
});
