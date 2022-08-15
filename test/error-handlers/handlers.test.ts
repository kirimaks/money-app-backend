import tap from 'tap';

import {getErrorMessage} from '../../src/errors/tools';


tap.test('Test regular error handler', async (test) => {
    try {
        throw new Error('Some error');

    } catch(error) {
        test.equal(getErrorMessage(error), 'Some error', 'Wrong error');
    }

    try {
        throw 'some error';
    } catch(error) {
        test.equal(getErrorMessage(error), 'Error message is not provided', 'Wrong error');
    }
});
