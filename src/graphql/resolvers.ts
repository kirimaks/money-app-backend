import type { IResolvers } from 'mercurius';


// TODO: name, surname,
type CreateUserPayload = {
    email: string;
    password: string;
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
        createUser(_root, {email}:CreateUserPayload) {
            console.log(`Create user: ${email}`);
            return 'done';
        }
    }
};

export default GraphQLResolvers;
