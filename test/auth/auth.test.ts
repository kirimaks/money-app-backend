import {randomBytes} from 'crypto';
import {v4 as uuidv4} from 'uuid';

import tap from 'tap';

import {buildApp, getAppConfig, generateModelIndexName} from '../helper';
import {UserModel} from '../../src/models/user/user';


function generateUser() {
    return {
        first_name: randomBytes(12).toString('hex'),
        last_name: randomBytes(12).toString('hex'),
        phone_number: randomBytes(5).toString('hex'),
        email: randomBytes(10).toString('hex'),
        password: randomBytes(12).toString('hex'),
        account_id: uuidv4(),
        comment: randomBytes(12).toString('hex'),
    }
}


tap.test('Test password hashing', async (test) => {
    const appConfig = getAppConfig();
    appConfig.USERS_INDEX_NAME = generateModelIndexName();

    const app = await buildApp(test, appConfig);
    const user = new UserModel(app, appConfig);

    const indexResp = await user.createIndex();
    test.ok(indexResp.acknowledged, 'Acknowledged is not true');

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
    test.ok(indexRemovingResp.acknowledged, 'Acknowledged is not true');
});

tap.test('Create user and log in', async (test) => {
    const appConfig = getAppConfig();
    appConfig.USERS_INDEX_NAME = generateModelIndexName();

    const app = await buildApp(test, appConfig);
    const userDraft:UserDraft = generateUser();
    const userModel = new UserModel(app, appConfig);

    test.before(async () => {
        await userModel.createIndex();
    });

    test.teardown(async () => {
        await userModel.deleteIndex();
    });

    test.test('Sign up test', async (signUpTest) => {
        const signUpResp = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: userDraft
        });

        app.log.debug(signUpResp.json());

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
    const appConfig = getAppConfig();
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
    const appConfig = getAppConfig();
    appConfig.USERS_INDEX_NAME = generateModelIndexName();

    const app = await buildApp(test, appConfig);
    const userDraft:UserDraft = generateUser();
    const userModel = new UserModel(app, appConfig);

    test.before(async () => {
        await userModel.createIndex();
    });

    test.teardown(async () => {
        await userModel.deleteIndex();
    });

    test.test('Sign up test', async (signUpTest) => {
        const signUpResp = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: userDraft
        });

        signUpTest.equal(signUpResp.statusCode, 201, 'Signup response is not 201');

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

            let sessionId:string;

            const cookieSession:any = logInResp.cookies[0];
            if (cookieSession) {
                sessionId = cookieSession['value'];
                app.log.debug(`Session: ${sessionId}`);
            }

            logInTest.test('Getting user data', async (myDataTest) => {
                const myAccountResp = await app.inject({
                    method: 'GET',
                    url: '/profile/',
                    cookies: {
                        'session-id': sessionId,
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
