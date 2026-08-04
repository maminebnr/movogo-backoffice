import { gql } from "@apollo/client";

export const GET_ALL_CARRIERS = gql`
  query GetAllCarriers {
    getAllCarriers {
      _id
      firstName
      lastName
      email
      walletBalance
      totalEarnings
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
  query GetAllAccounts($pagination: PaginationInput) {
    getAllAccounts(pagination: $pagination) {
      _id
      firstName
      lastName
      email
      role
      verified
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
      totalPrice
      distanceKm
      deliveryOption
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
      totalPrice
      distanceKm
      deliveryOption
    }
  }
`;

export const GET_ALL_DELIVERIES = gql`
  query GetAllDeliveries {
    getAllDeliveries {
      _id
      status
      senderId
      senderName
      carrierId
      carrierName
      totalPrice
      distanceKm
      deliveryOption
      paymentMethod
      createdAt
    }
  }
`;

export const GET_APP_GAIN_AND_FUNDS = gql`
  query GetAppGainAndFunds {
    getAppGainHistory {
      _id
      appGain
      totalPrice
      carrierGain
      date
      distanceKm
      deliveryOption
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
      priceMultiplier
    }
  }
`;
