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
        signIn(email:String! password:String!):String!
        signUp(email:String! password:String! firstName:String! lastName: String!): String!
    }
`;

export default GraphQLSchema;
