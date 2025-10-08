// // import { createHandler } from "graphql-http";
// // import { buildSchema } from "graphql";
// import path from 'path';
// import { makeExecutableSchema } from '@graphql-tools/schema';
// import { loadFilesSync } from '@graphql-tools/load-files';
// import { graphqlHTTP } from 'express-graphql';

// import resolvers from './resolvers.js';

// console.log(import.meta.dirname);
// const typeDefs = loadFilesSync(path.join(import.meta.dirname, './schema.graphql'));
// const rootSchema = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });

// const handler = (req) => {
//   const isDEV = process.env.NODE_ENV === 'development';
//   const ioServerInstance = req?.app?.get('io');
//   const context = {
//     user: req?.user,
//     isAuthenticated: req?.isAuthenticated(),
//     ioServer: ioServerInstance
//   };
//   return { schema: rootSchema, context, graphiql: true };
// };

// const graphqlMiddlewareHandler = graphqlHTTP(handler);

// export default graphqlMiddlewareHandler;

import path from 'path';
import { fileURLToPath } from 'url';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';
import { graphqlHTTP } from 'express-graphql';
import resolvers from './resolvers.js';

// ✅ Safe __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .graphql file reliably
const schemaPath = path.join(__dirname, './schema.graphql');
const typeDefs = loadFilesSync(schemaPath);

if (!typeDefs?.length) {
  console.error(`❌ Failed to load GraphQL schema at: ${schemaPath}`);
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const handler = (req) => {
  const ioServerInstance = req?.app?.get('io');
  const context = {
    user: req?.user,
    isAuthenticated: req?.isAuthenticated?.(),
    ioServer: ioServerInstance
  };

  return {
    schema,
    context,
    graphiql: process.env.NODE_ENV === 'development'
  };
};

export default graphqlHTTP(handler);
