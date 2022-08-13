import {randomBytes} from 'crypto';

import tap from 'tap';

import {buildApp, getTestAppConfig, generateUser} from '../helper';
import {UserModel} from '../../src/models/user/user';



tap.test('Test password hashing', async (test) => {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const user = new UserModel(app, appConfig);

    const createIndexResp = await user.createIndex();
    test.ok(createIndexResp.acknowledged, 'Acknowledged is not true');

    const userDraft:UserDraft = generateUser();
    const docResp = await user.createDocument(userDraft);

    test.ok(docResp.password.hash, 'Hash is null');
    test.ok(docResp.password.salt, 'Salt is null');

    const savingResp = await user.saveDocument(docResp);

    if (!savingResp.success) {
        app.log.error(savingResp);
    }

    test.ok(savingResp.success, 'Response is not successful');

    const invalidSession = await user.verifyPassword(userDraft.email, randomBytes(8).toString('hex'));
    const validSession = await user.verifyPassword(userDraft.email, userDraft.password);

    test.ok(invalidSession.anonymous, 'Password is not invalid');
    test.notOk(invalidSession.user_id, 'User id is not empty');
    test.notOk(invalidSession.account_id, 'Account id is not empty');

    test.notOk(validSession.anonymous, 'Password is invalid');
    test.equal(validSession.user_id, docResp.record_id, 'Wrong user id');
    test.equal(validSession.account_id, docResp.account_id, 'Wrong account id');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp, 'Acknowledged is not true');
});

tap.test('Create user and log in', async (test) => {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const userDraft:UserDraft = generateUser();

    test.test('Sign up test', async (signUpTest) => {
        const signUpResp = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: userDraft
        });

        signUpTest.equal(signUpResp.statusCode, 201, 'Signup response is not 201');
        signUpTest.equal(signUpResp.json().message, 'User created', 'Wrong message');

        signUpTest.test('Log in tst', async (logInTest) => {
            const logInResp = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: userDraft.email,
                    password: userDraft.password
                }
            });

            logInTest.equal(logInResp.statusCode, 200, 'Log in response is not 200');
            logInTest.equal(logInResp.json().message, 'Logged in, session saved', 'Wrong message');
        });
    });

});

tap.test('Login with wrong credentials', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);

    const logInResp = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
            email: randomBytes(8).toString('hex'),
            password: randomBytes(8).toString('hex'),
        }
    });

    test.equal(logInResp.statusCode, 400, 'Auth error response code is not 400');
});

tap.test('Log in and make sure user getting proper info', async (test) =>  {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const userDraft:UserDraft = generateUser();

    test.test('Sign up test', async (signUpTest) => {
        const signUpResp = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: userDraft
        });

        signUpTest.equal(signUpResp.statusCode, 201, 'Signup response is not 201');

        signUpTest.test('Log in test', async (logInTest) => {
            const logInResp = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: userDraft.email,
                    password: userDraft.password
                }
            });

            logInTest.equal(logInResp.statusCode, 200, 'Log in response is not 200');

            const sessionCookie:Cookie|undefined = (logInResp.cookies as Cookie[]).find((cookie) => {
                return cookie.name === 'session-id';
            });

            if (!sessionCookie) {
                test.fail('Session cookie is null');
                return;
            }

            logInTest.test('Getting user data', async (myDataTest) => {
                const myAccountResp = await app.inject({
                    method: 'GET',
                    url: '/profile',
                    cookies: {
                        'session-id': sessionCookie.value,
                    }
                });

                if (myAccountResp.statusCode !== 200) {
                    app.log.error(myAccountResp.json());
                }

                myDataTest.equal(myAccountResp.statusCode, 200, 'Response for profile is not 200');
                myDataTest.equal(myAccountResp.json().first_name, userDraft.first_name, 'Wrong first name');
                myDataTest.equal(myAccountResp.json().last_name, userDraft.last_name, 'Wrong first name');
            });
        });
    });
});
