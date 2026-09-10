import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideApollo } from 'apollo-angular';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),

    provideApollo(() => {
      const httpLink = createHttpLink({
        uri: 'http://localhost:5002/graphql',
        credentials: 'include',
      });

      return new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
      });
    }),
  ],
};
