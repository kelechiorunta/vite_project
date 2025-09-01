// import { createHandler } from "graphql-http";
// import { buildSchema } from "graphql";
import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { graphqlHTTP } from 'express-graphql';

import resolvers from './resolvers.js';

console.log(import.meta.dirname);
const typeDefs = loadFilesSync(path.join(import.meta.dirname, './schema.graphql'));
const rootSchema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });

const handler = (req) => {
  const isDEV = process.env.NODE_ENV === 'development';
  const ioServerInstance = req?.app?.get('io');
  const context = {
    user: req?.user,
    isAuthenticated: req?.isAuthenticated(),
    ioServer: ioServerInstance
  };
  return { schema: rootSchema, context, graphiql: true };
};

const graphqlMiddlewareHandler = graphqlHTTP(handler);

export default graphqlMiddlewareHandler;
