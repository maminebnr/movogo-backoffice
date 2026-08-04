import { gql } from "@apollo/client";

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
      priceMultiplier
    }
  }
`;

export const ADD_FUNDS = gql`
  mutation AddFunds($input: AddFundsInput!) {
    addFunds(input: $input) {
      _id
      walletBalance
      status
    }
  }
`;

export const SET_CARRIER_STATUS = gql`
  mutation SetCarrierStatus($email: String!, $status: CarrierStatus!) {
    setCarrierStatus(email: $email, status: $status) {
      _id
      status
      walletBalance
    }
  }
`;
