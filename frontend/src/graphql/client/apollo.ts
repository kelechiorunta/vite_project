import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const graphqlClient = new ApolloClient({
  link: new HttpLink({
    uri:
      process.env.NODE_ENV === 'production'
        ? 'https://vite-project-1vp3.onrender.com/graphql'
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
