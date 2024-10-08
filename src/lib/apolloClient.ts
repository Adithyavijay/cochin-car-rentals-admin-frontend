import { ApolloClient, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';// Add this import


const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include', // This sends cookies with the request
});

const client = new ApolloClient({
  link: uploadLink, // Use the upload link instead of httpLink
  cache: new InMemoryCache(),
});

export default client;
