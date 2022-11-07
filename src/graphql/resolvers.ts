import type { IResolvers } from 'mercurius';


type CreateUserPayload = {
    email: string;
};

type LogInPayload = {
    email: string;
    password: string;
};

const gqlResolvers:IResolvers = {
    Query: {
        login(_root, {email, password}:LogInPayload) {
            console.log(`Login: ${email}, ${password}`);

            return 'hello';
        }
    },
    Mutation: {
        createUser(_root, {email}:CreateUserPayload) {
            console.log(`Create user: ${email}`);
            return 'done';
        }
    }
};

export default gqlResolvers;
