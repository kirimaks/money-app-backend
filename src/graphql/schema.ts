const GraphQLSchema = `
    type User {
        email: String!
    }

    type Query {
        test(hello:String):String
    }

    type Mutation {
        login(email:String! password:String!):String!
        createUser(email:String!): String!
    }
`;

export default GraphQLSchema;
