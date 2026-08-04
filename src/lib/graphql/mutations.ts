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

export const UPDATE_VEHICLE_TYPE = gql`
  mutation UpdateVehicleType($input: UpdateVehicleTypeInput!) {
    updateVehicleType(input: $input) {
      _id
      name
      description
      iconName
      iconURL
      priceMultiplier
    }
  }
`;

export const DELETE_VEHICLE_TYPE = gql`
  mutation DeleteVehicleType($id: String!) {
    deleteVehicleType(id: $id)
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

export const FORCE_VERIFY_ACCOUNT = gql`
  mutation ForceVerifyAccount($accountId: String!) {
    forceVerifyAccount(accountId: $accountId) {
      _id
      verified
    }
  }
`;

export const SET_ACCOUNT_DISABLED = gql`
  mutation SetAccountDisabled($accountId: String!, $disabled: Boolean!) {
    setAccountDisabled(accountId: $accountId, disabled: $disabled) {
      _id
      disabled
    }
  }
`;

export const UPDATE_ACCOUNT_BY_ADMIN = gql`
  mutation UpdateAccountByAdmin($input: UpdateAccountByAdminInput!) {
    updateAccountByAdmin(input: $input) {
      _id
      firstName
      lastName
      email
      role
      verified
      disabled
    }
  }
`;

export const CREATE_ACCOUNT_BY_ADMIN = gql`
  mutation CreateAccountByAdmin($input: CreateAccountByAdminInput!) {
    createAccountByAdmin(input: $input) {
      _id
      firstName
      lastName
      email
      role
      verified
      disabled
    }
  }
`;

export const ADMIN_CANCEL_DELIVERY = gql`
  mutation AdminCancelDelivery($input: AdminCancelDeliveryInput!) {
    adminCancelDelivery(input: $input) {
      _id
      status
      cancelReason
      cancelledBy
    }
  }
`;

export const ADMIN_CHANGE_DELIVERY_STATUS = gql`
  mutation AdminChangeDeliveryStatus($input: AdminChangeDeliveryStatusInput!) {
    adminChangeDeliveryStatus(input: $input) {
      _id
      status
    }
  }
`;
