const axios = require("axios");
const { ApolloServer, gql } = require("apollo-server");

// create axios instance for typicode server
const typicode = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com"
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
    users: [User]
  }

  type Mutation {
    updateUser(id: ID, user: UserInput): User
  }

  input UserInput {
    name: String
  }

  type User {
    id: ID
    name: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello world!";
    },
    users: (root, args, context) => {
      return typicode.get("/users").then(res => res.data);
    }
  },

  Mutation: {
    updateUser(root, { id, user }) {
      return typicode.patch(`/users/${id}`, user).then(res => res.data);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
