import { gql } from "@apollo/client";

// Login mutation - matches the API schema
// LoginResponse only has: accessToken, refreshToken, message (no user field)
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      message
    }
  }
`;

export const ADD_VEHICLE_TYPE = gql`
  mutation AddVehicleType($input: CreateVehicleTypeInput!) {
    addVehicleType(input: $input) {
      _id
      name
      description
      iconName
      iconURL
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($input: VerifyAccountInput!) {
    verifyAccount(input: $input) {
      _id
      firstName
      lastName
      email
      role
    }
  }
`;
