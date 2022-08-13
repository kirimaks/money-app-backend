import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';


tap.test('Cannot access to profile without session', async (test) => {
    const appConfig = getAppConfig();
    const app = await buildApp(test, appConfig);

    const resp = await app.inject({
        method: 'GET',
        url: '/profile',
    });

    test.equal(resp.statusCode, 401, 'Unauthorized response code is not 401');
});
