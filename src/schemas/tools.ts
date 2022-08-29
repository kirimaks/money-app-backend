import {ACCOUNT_SCHEMAS} from './account';
import {USER_SCHEMAS} from './user';
import {AUTH_SCHEMAS} from './auth';
import {ERROR_SCHEMAS} from './errors';
import {TRANSACTION_SCHEMAS} from './transaction';
import {CATEGORY_SCHEMAS} from './category';
import {PROFILE_SCHEMAS} from './profile';

/* TODO: refactor to plugin */

export async function * getSchemas() {
    for (const schema of ACCOUNT_SCHEMAS) {
        yield schema;
    }

    for (const schema of USER_SCHEMAS) {
        yield schema;
    }

    for (const schema of AUTH_SCHEMAS) {
        yield schema;
    }

    for (const schema of ERROR_SCHEMAS) {
        yield schema;
    }

    for (const schema of TRANSACTION_SCHEMAS) {
        yield schema;
    }

    for (const schema of CATEGORY_SCHEMAS) {
        yield schema;
    }

    for (const schema of PROFILE_SCHEMAS) {
        yield schema;
    }
}
