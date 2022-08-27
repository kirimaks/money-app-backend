import {randomBytes} from 'crypto';
import {validate as validateUUID} from 'uuid';

import tap from 'tap';

import {buildApp, getTestAppConfig, generateUser, generateSignUpRequest} from '../helper';
import {UserModel} from '../../src/models/user/user';
import {AuthError} from '../../src/errors/tools';


tap.test('Test password hashing', async (test) => {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const user = new UserModel(app.log, app.elastic, appConfig.USERS_INDEX_NAME);

    const createIndexResp = await user.createIndex();
    test.ok(createIndexResp.acknowledged, 'Acknowledged is not true');

    const userDraft:UserDraft = generateUser();
    const docResp = await user.createDocumentMap(userDraft);

    test.ok(docResp.document.password.hash, 'Hash is null');
    test.ok(docResp.document.password.salt, 'Salt is null');

    const userId = await docResp.save();

    test.ok(validateUUID(userId), 'User id is invalid');

    try {
        await user.verifyPassword(userDraft.email, randomBytes(8).toString('hex'));
    } catch(error) {
        test.ok(error instanceof AuthError, 'Wrong error thrown');
    }

    const validSession = await user.verifyPassword(userDraft.email, userDraft.password);

    test.notOk(validSession.anonymous, 'Password is invalid');
    test.equal(validSession.user_id, docResp.document.user_id, 'Wrong user id');
    test.equal(validSession.account_id, docResp.document.account_id, 'Wrong account id');

    const indexRemovingResp = await user.deleteIndex();
    test.ok(indexRemovingResp, 'Acknowledged is not true');
});

tap.test('Create user and log in', async (test) => {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const signUpPayload = generateSignUpRequest();

    test.test('Sign up test', async (signUpTest) => {
        const signUpResp = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: signUpPayload,
        });

        signUpTest.equal(signUpResp.statusCode, 201, 'Signup response is not 201');

        signUpTest.test('Log in tst', async (logInTest) => {
            const logInResp = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: signUpPayload.email,
                    password: signUpPayload.password
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

    test.equal(logInResp.statusCode, 401, 'Auth error response code is not 401');
});

tap.test('Log in and make sure user getting proper info', async (test) =>  {
    const appConfig = getTestAppConfig();

    const app = await buildApp(test, appConfig);
    const signUpPayload = generateSignUpRequest();

    test.test('Sign up test', async (signUpTest) => {
        const signUpResp = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: signUpPayload
        });

        signUpTest.equal(signUpResp.statusCode, 201, 'Signup response is not 201');

        signUpTest.test('Log in test', async (logInTest) => {
            const logInResp = await app.inject({
                method: 'POST',
                url: '/auth/login',
                payload: {
                    email: signUpPayload.email,
                    password: signUpPayload.password
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
                myDataTest.equal(myAccountResp.json().first_name, signUpPayload.first_name, 'Wrong first name');
                myDataTest.equal(myAccountResp.json().last_name, signUpPayload.last_name, 'Wrong first name');

                myDataTest.test('Log out', async (logOutTest) => {
                    const logOutResp = await app.inject({
                        method: 'GET',
                        url: '/auth/logout',
                        cookies: {
                            'session-id': sessionCookie.value,
                        }
                    });
                    logOutTest.equal(logOutResp.statusCode, 204, 'Log out return not 200');
                });
            });
        });
    });
});

tap.test('Sign up response format', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const newAccount = generateSignUpRequest();

    const signUpResponse = await app.inject({
        url: '/auth/signup',
        method: 'POST',
        payload: newAccount,
    });

    test.equal(signUpResponse.statusCode, 201, 'Response code for sign up is not 201');
    test.ok(validateUUID(signUpResponse.json().user_id), 'User id is invalid');
    test.ok(validateUUID(signUpResponse.json().account_id), 'Account id is invalid');
});
