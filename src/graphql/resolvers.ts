import type { IResolvers } from 'mercurius';


const GraphQLResolvers:IResolvers = {
    Query: {
        test(obj, payload, context) {
            context.app.log.debug(`Obj: ${JSON.stringify(obj)}`);
            return 'hello';
        }
    },
    Mutation: {
        login(obj, payload, context) {
            context.app.log.debug(`Obj: ${JSON.stringify(obj)}`);
            context.app.log.debug(`Login: ${JSON.stringify(payload)}`);
            return 'token';
        },
        createUser(obj, payload, context) {
            context.app.log.debug(`Obj: ${JSON.stringify(obj)}`);
            context.app.log.debug(`New user: ${JSON.stringify(payload)}`);
            return 'done';
        }
    }
};

export default GraphQLResolvers;
