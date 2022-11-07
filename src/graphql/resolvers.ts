import type { IResolvers } from 'mercurius';


// type CreateUserPayload = {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
// };
// 
// type LogInPayload = {
//     email: string;
//     password: string;
// };

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
