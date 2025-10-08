import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlClient = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NODE_ENV === 'production'
        ? 'https://justchat-app.vercel.app/graphql'
        : 'http://localhost:3302/graphql',
    credentials: 'include'
  }),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['_id']
      }
    }
  })
});

export default graphqlClient;
