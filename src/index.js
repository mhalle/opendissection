import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import * as ReactGA from 'react-ga-donottrack';

const client = new ApolloClient({
  // uri: 'http://localhost:8001/graphql/bassett',
  // connectToDevtools: true,
  uri: 'https://bassett-anatomy.vercel.app/graphql/bassett',

  cache: new InMemoryCache({
  })
});
window.apolloClient = client;
window.gql = gql;
ReactGA.initialize('UA-125634700-3');

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
