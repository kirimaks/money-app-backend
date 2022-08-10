import {ACCOUNT_SCHEMAS} from './account';
import {USER_SCHEMAS} from './user';
import {AUTH_SCHEMAS} from './auth';


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
}
