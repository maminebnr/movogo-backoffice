import { gql } from "@apollo/client";

export const GET_ALL_CARRIERS = gql`
  query GetAllCarriers {
    getAllCarriers {
      _id
      firstName
      lastName
      email
      walletBalance
      status
    }
  }
`;

export const GET_ALL_SENDERS = gql`
  query GetAllSenders {
    getAllSenders {
      _id
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;

export const GET_ALL_ACCOUNTS = gql`
  query GetAllAccounts {
    getAllAccounts {
      _id
      firstName
      lastName
      email
      role
    }
  }
`;

export const GET_TODAY_DELIVERIES = gql`
  query GetTodayDeliveries {
    todaysDeliveries {
      _id
      status
      senderId
      senderName
      carrierId
      carrierName
      createdAt
    }
  }
`;

export const GET_ACTIVE_DELIVERIES = gql`
  query GetActiveDeliveries {
    availableDeliveries {
      _id
      status
      senderId
      senderName
      carrierId
      carrierName
    }
  }
`;

export const GET_APP_GAIN_AND_FUNDS = gql`
  query GetAppGainAndFunds {
    getAppGainHistory {
      _id
      appGain
      totalPrice
      date
    }
  }
`;

export const GET_VEHICLE_TYPES = gql`
  query GetVehicleTypes {
    getVehicleTypes {
      _id
      name
      description
      iconName
      iconURL
    }
  }
`;

