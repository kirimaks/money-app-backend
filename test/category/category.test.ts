import tap from 'tap';
import {v4 as uuidv4, validate as validateUUID} from 'uuid';

import {buildApp, getTestAppConfig, generateSession} from '../helper';
import {generateCategory} from './test-tools';
import {generateTransaction} from '../transaction/test-tools';


tap.test('Create, get and remove category', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    await app.models.category.createIndex();

    const categoryPayload = generateCategory();

    test.test('Create category', async (createCategoryTest) => {
        const newCategoryResp = await app.inject({
            method: 'POST',
            url: '/categories/new-category',
            cookies: {
                'session-id': session.cookie,
            },
            payload: categoryPayload
        });

        const newCategoryId = newCategoryResp.json().category_id;

        createCategoryTest.equal(newCategoryResp.statusCode, 201, 'Response code for new category is not 201');
        createCategoryTest.ok(validateUUID(newCategoryId), 'Category id is invalid');

        createCategoryTest.test('Get category', async (getCategoryTest) => {
            const categoryResp = await app.inject({
                method: 'GET',
                url: `/categories/${newCategoryId}`,
                cookies: {
                    'session-id': session.cookie,
                },
            });

            getCategoryTest.equal(categoryResp.statusCode, 200, 'Response code is not 200');
            getCategoryTest.equal(categoryResp.json().category_id, newCategoryId, 'Wrong id');

            getCategoryTest.test('Delete category', async (deleteCategoryTest) => {
                const deleteResp = await app.inject({
                    method: 'DELETE',
                    url: `/categories/${newCategoryId}`,
                    cookies: {
                        'session-id': session.cookie,
                    }
                });

                deleteCategoryTest.equal(deleteResp.statusCode, 204, 'Response code is not 204');
            });
        });
    });
});

tap.test('Get missing category', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    const categoryId = uuidv4();

    const resp = await app.inject({
        method: 'GET',
        url: `/categories/${categoryId}`,
        cookies: {
            'session-id': session.cookie,
        }
    });

    test.equal(resp.statusCode, 404, 'Wrong status code for missing category');
});

tap.test('Delete missing category', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    const categoryId = uuidv4();

    const resp = await app.inject({
        method: 'DELETE',
        url: `/categories/${categoryId}`,
        cookies: {
            'session-id': session.cookie,
        }
    });

    test.equal(resp.statusCode, 404, 'Wrong status code for missing category');
});

tap.test('Create transaction for category', async (test) => {
    const appConfig = getTestAppConfig();
    const app = await buildApp(test, appConfig);
    const session = await generateSession(app, appConfig);

    await app.models.transaction.createIndex();
    await app.models.category.createIndex();

    test.test('Create category', async (createCategoryTest) => {
        const categoryPayload = generateCategory();
        const newCategoryResp = await app.inject({
            method: 'POST',
            url: '/categories/new-category',
            cookies: {
                'session-id': session.cookie,
            },
            payload: categoryPayload
        });

        const newCategoryId = newCategoryResp.json().category_id;

        createCategoryTest.equal(newCategoryResp.statusCode, 201, 'Response code for new category is not 201');

        createCategoryTest.test('Craete transaction with category', async (createTransactionTest) => {
            const transactionPayload = generateTransaction(session.user_id, session.account_id);
            transactionPayload.category_id = newCategoryId;

            const transactionResp = await app.inject({
                method: 'POST',
                url: '/transactions/new-transaction',
                cookies: {
                    'session-id': session.cookie,
                },
                payload: transactionPayload,
            });

            createTransactionTest.equal(transactionResp.statusCode, 201, 'Response for new transaction is not 201');
            createTransactionTest.equal(transactionResp.json().category_id, newCategoryId, 'Wrong category id');
        });
    });
});
