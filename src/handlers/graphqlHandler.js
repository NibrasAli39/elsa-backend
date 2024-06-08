const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const typeDefs = require("../graphql/schema");
const resolvers = require("../resolvers");
const { verifyToken } = require("../utils/auth");
require("dotenv").config();

const app = express();

const context = ({ req }) => {
  const token = req.headers.authorization || "";
  const user = verifyToken(token.replace("Bearer ", ""));
  return { user };
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  playground: true,
  introspection: true,
});

server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql" });
});

module.exports.handler = serverless(app);
