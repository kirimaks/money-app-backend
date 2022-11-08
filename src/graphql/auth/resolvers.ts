import { createUser, UserExistError, AuthError, login, getErrorMessage } from './tools';
import Mercurius from 'mercurius';

import type { IFieldResolver, MercuriusContext } from 'mercurius';
import type { SignInPayload, SignUpPayload } from './types';


const signUpResolver:IFieldResolver<unknown, MercuriusContext, SignUpPayload> = async (root, payload, context) => {
    context.app.log.debug(`Obj: ${JSON.stringify(root)}`);
    context.app.log.debug(`New user: ${JSON.stringify(payload)}`);

    try {
        return await createUser(context.app.log, payload);

    } catch(error) {
        if (error instanceof UserExistError) {
            throw new Mercurius.ErrorWithProps(error.message, { email: payload.email }, 400);
        }

        const errorMessage = getErrorMessage(error);
        throw new Mercurius.ErrorWithProps(errorMessage, {}, 500);
    }
};

const signInResolver:IFieldResolver<unknown, MercuriusContext, SignInPayload> = async (root, payload, context) => {
    context.app.log.debug(`Obj: ${JSON.stringify(root)}`);
    context.app.log.debug(`Login: ${JSON.stringify(payload)}`);

    try {
        return await login(context.app.log, payload);

    } catch(error) {
        if (error instanceof AuthError) {
            throw new Mercurius.ErrorWithProps(error.message, {}, 400);
        }

        const errorMessage = getErrorMessage(error);
        throw new Mercurius.ErrorWithProps(errorMessage, {}, 500);
    }
};

export { signUpResolver, signInResolver };
