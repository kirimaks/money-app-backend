const gqlSchema = `
    type User {
        email: String!
    }

    type Query {
        login(email: String! password: String!): String!
    }

    type Mutation {
        createUser(email: String!): String!
    }
`;

export default gqlSchema;
