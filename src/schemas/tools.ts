import {ACCOUNT_SCHEMAS} from './account';


export async function * getSchemas() {
    for (const schema of ACCOUNT_SCHEMAS) {
        yield schema;
    }
}
