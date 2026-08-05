import { gql } from "@apollo/client";

export const GET_ALL_CARRIERS = gql`
  query GetAllCarriers {
    getAllCarriers {
      _id
      firstName
      lastName
      email
      phoneNumber
      accountId
      walletBalance
      totalEarnings
      status
      walletHistory {
        deliveryId
        amount
        remainingBalance
        type
        dateOperation
      }
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
      disabled
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
      paymentMethod
      promoCode
      scheduledFor
      visibleToCarriers
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
      scheduledFor
      visibleToCarriers
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
      promoCode
      scheduledFor
      visibleToCarriers
      createdAt
    }
  }
`;

export const GET_DELIVERY = gql`
  query GetDelivery($_id: String!) {
    delivery(_id: $_id) {
      _id
      status
      senderId
      senderName
      carrierId
      carrierName
      carrierPhone
      totalPrice
      distanceKm
      deliveryOption
      paymentMethod
      promoCode
      discountAmount
      scheduledFor
      visibleToCarriers
      cancelReason
      cancelledBy
      pickupAddress {
        street
        city
        lat
        lng
      }
      deliveryAddress {
        street
        city
        lat
        lng
      }
      pickupContact {
        name
        phoneNumber
      }
      contactInfo {
        name
        phoneNumber
      }
      lastLocationCarrier {
        longitude
        latitude
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($deliveryId: String!) {
    getMessages(deliveryId: $deliveryId) {
      _id
      content
      senderId
      senderRole
      mediaUrl
      mediaType
      createdAt
    }
  }
`;

export const GET_APP_GAIN_AND_FUNDS = gql`
  query GetAppGainAndFunds {
    getAppGainHistory {
      _id
      deliveryId
      carrierId
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

export const GET_ALL_PROMO_CODES = gql`
  query GetAllPromoCodes {
    getAllPromoCodes {
      _id
      code
      discountType
      discountValue
      message
      active
    }
  }
`;

export const GET_PRICING_SETTINGS = gql`
  query GetPricingSettings {
    getPricingSettings {
      _id
      carrierGain
      appGain
      minInWallet
      minAbsolute
      initialFare
      initialFareExpress
      kmPrice
      expressKmPrice
    }
  }
`;
