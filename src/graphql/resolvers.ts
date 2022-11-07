import type { IResolvers } from 'mercurius';


type CreateUserPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

type LogInPayload = {
    email: string;
    password: string;
};

const GraphQLResolvers:IResolvers = {
    Query: {
        test(_root, {hello}) {
            return 'hello';
        }
    },
    Mutation: {
        login(_root, {email, password}:LogInPayload) {
            console.log(`Login: ${email}, ${password}`);
            return 'token';
        },
        createUser(obj, args, context) {
            context.app.log.debug(`New user: ${JSON.stringify(args)}`);

            return 'done';
        }
    }
};

export default GraphQLResolvers;
