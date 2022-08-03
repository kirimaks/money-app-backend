import {ACCOUNT_SCHEMAS} from './account';
import {USER_SCHEMAS} from './user';


export async function * getSchemas() {
    for (const schema of ACCOUNT_SCHEMAS) {
        yield schema;
    }

    for (const schema of USER_SCHEMAS) {
        yield schema;
    }
}
