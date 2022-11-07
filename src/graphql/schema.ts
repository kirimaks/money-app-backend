const GraphQLSchema = `
    type User {
        email: String!
        firstName: String!
        lastName: String!
    }

    type Query {
        test(hello:String):String
    }

    type Mutation {
        login(email:String! password:String!):String!
        createUser(email:String! password:String! firstName:String! lastName: String!): String!
    }
`;

export default GraphQLSchema;
