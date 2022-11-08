import type { IResolvers } from 'mercurius';

import { signUpResolver, signInResolver } from './auth';


const GraphQLResolvers:IResolvers = {
    Query: {
        test(obj, payload, context) {
            context.app.log.debug(`Obj: ${JSON.stringify(obj)}`);
            return 'hello';
        }
    },
    Mutation: {
        signIn: signInResolver,
        signUp: signUpResolver,
    }
};

export default GraphQLResolvers;
