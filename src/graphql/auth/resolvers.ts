import { createUser, UserExistError } from './tools';
import Mercurius from 'mercurius';

import type { IFieldResolver, MercuriusContext } from 'mercurius';
import type { SignInPayload, SignUpPayload } from './types';


const signUpResolver:IFieldResolver<unknown, MercuriusContext, SignUpPayload> = async (root, payload, context) => {
    context.app.log.debug(`Obj: ${JSON.stringify(root)}`);
    context.app.log.debug(`New user: ${JSON.stringify(payload)}`);

    try {
        await createUser(context.app.log, payload);
        return 'ok';

    } catch(error) {
        if (error instanceof UserExistError) {
            throw new Mercurius.ErrorWithProps(error.message, { email: payload.email }, 400);
        }

        if (error instanceof Error) {
            throw new Mercurius.ErrorWithProps(error.message, {}, 500);
        }
    }
};

const signInResolver:IFieldResolver<unknown, MercuriusContext, SignInPayload> = async (root, payload, context) => {
    context.app.log.debug(`Obj: ${JSON.stringify(root)}`);
    context.app.log.debug(`Login: ${JSON.stringify(payload)}`);

    return 'token';
};

export { signUpResolver, signInResolver };
