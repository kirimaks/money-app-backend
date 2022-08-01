import tap from 'tap';

import {buildApp, getAppConfig} from '../helper';


tap.test('Test invalid config', async (test) => {

    const appConfig = getAppConfig();
    appConfig.ACCOUNTS_INDEX_NAME = '';

    try {
        const app = await buildApp(test, appConfig);
        console.log(app);
        test.fail('Should fail here');

    } catch(err) {
        test.pass('Should pass here');
    }
});
