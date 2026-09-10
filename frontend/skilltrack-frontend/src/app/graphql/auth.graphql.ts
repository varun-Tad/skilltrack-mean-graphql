import { gql } from 'apollo-angular';

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        _id
        name
        email
        role
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      _id
      name
      email
      role
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
