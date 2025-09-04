import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { ApolloProvider } from '@apollo/client/react';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.tsx';

import ThemeProvider from './components/ThemeProvider.tsx';
import graphqlClient from './graphql/client/apollo.ts';

import '@radix-ui/themes/styles.css';
import '@radix-ui/themes/layout.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={graphqlClient}>
        <ThemeProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <App />
        </ThemeProvider>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
);
