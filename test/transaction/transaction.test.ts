import tap from 'tap';
import {v4 as uuidv4, validate as validateUUID} from 'uuid';

import {buildApp, getTestAppConfig, generateSession} from '../helper';
import {generateTransaction} from './test-tools';


tap.test('Create, get and delete transaction', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    await app.models.transaction.createIndex();
    const session = await generateSession(app, appConfig);

    const transactionPayload = generateTransaction(session.user_id, session.account_id);

    test.test('Create transaction', async (createTransactionTest) => {
        const newTransactionResp = await app.inject({
            method: 'POST',
            url: '/transactions/new-transaction',
            cookies: {
                'session-id': session.cookie,
            },
            payload: transactionPayload,
        });

        const newTransactionId = newTransactionResp.json().transaction_id;

        createTransactionTest.equal(newTransactionResp.statusCode, 201, 'Response code for new transaction is not 201');
        createTransactionTest.ok(validateUUID(newTransactionId), 'Transaction id is invalid');

        createTransactionTest.test('Get transaction', async (getTransactionTest) => {
            const transactionResp = await app.inject({
                method: 'GET',
                url: `/transactions/${newTransactionId}`,
                cookies: {
                    'session-id': session.cookie,
                }
            });

            getTransactionTest.equal(transactionResp.statusCode, 200, 'Status code for existing transaciton is not 200');
            getTransactionTest.equal(transactionResp.json().transaction_id, newTransactionId, 'Wrong id');

            getTransactionTest.test('Delete transaction', async (deleteTransactionTest) => {
                const deleteResp = await app.inject({
                    method: 'DELETE',
                    url: `/transactions/${newTransactionId}`,
                    cookies: {
                        'session-id': session.cookie,
                    }
                });

                deleteTransactionTest.equal(deleteResp.statusCode, 204, 'Wrong status code for delete request');
            });
        });
    });
});

tap.test('Getting missing transaction', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    const transactionId = uuidv4();
    
    const resp = await app.inject({
        method: 'GET',
        url: `/transactions/${transactionId}`,
        cookies: {
            'session-id': session.cookie,
        }
    });

    test.equal(resp.statusCode, 404, 'Wrong status code for missing transaction');
    test.equal(resp.json().message, 'Not Found', 'Wrong error message');
});

tap.test('Removing missing transaction', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    const transactionId = uuidv4();
    
    const resp = await app.inject({
        method: 'DELETE',
        url: `/transactions/${transactionId}`,
        cookies: {
            'session-id': session.cookie,
        }
    });

    test.equal(resp.statusCode, 404, 'Wrong status code for missing transaction');
    test.equal(resp.json().message, 'Not Found', 'Wrong error message');
});

tap.test('Test recent transactions', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    await app.models.transaction.createIndex();

    test.test('Create transaction', async (createTransactionTest) => {
        const transactionPayload = generateTransaction(session.user_id, session.account_id);

        const newTransactionResp = await app.inject({
            method: 'POST',
            url: '/transactions/new-transaction',
            cookies: {
                'session-id': session.cookie,
            },
            payload: transactionPayload,
        });

        createTransactionTest.equal(
            newTransactionResp.statusCode, 201, 'Response code for new transaction is not 201'
        );

        createTransactionTest.test('Test recent transactions', async (recentTransactionsTest) => {
            const latestTransactionsResp = await app.inject({
                method: 'GET',
                url: '/transactions/latest',
                cookies: {
                    'session-id': session.cookie,
                }
            });

            recentTransactionsTest.equal(latestTransactionsResp.statusCode, 200, 'Response for latest transactions not 200');
            recentTransactionsTest.equal(latestTransactionsResp.json().transactions[0].name, transactionPayload.name, 'Wrong transaction name');
        });
    });
});
