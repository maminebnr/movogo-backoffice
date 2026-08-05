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

export const DEDUCT_FUNDS = gql`
  mutation DeductFunds($input: AddFundsInput!) {
    deductFunds(input: $input) {
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

export const UPDATE_CARRIER_PHONE = gql`
  mutation UpdateCarrierPhoneByAdmin($email: String!, $phoneNumber: String!) {
    updateCarrierPhoneByAdmin(email: $email, phoneNumber: $phoneNumber) {
      _id
      phoneNumber
    }
  }
`;

export const UPDATE_SENDER_PHONE = gql`
  mutation UpdateSenderPhoneByAdmin($email: String!, $phoneNumber: String!) {
    updateSenderPhoneByAdmin(email: $email, phoneNumber: $phoneNumber) {
      _id
      phoneNumber
      email
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

export const ADMIN_ASSIGN_CARRIER = gql`
  mutation AdminAssignCarrier($input: AdminAssignCarrierInput!) {
    adminAssignCarrier(input: $input) {
      _id
      status
      carrierId
      carrierName
    }
  }
`;

export const ADMIN_UNASSIGN_CARRIER = gql`
  mutation AdminUnassignCarrier($deliveryId: String!) {
    adminUnassignCarrier(deliveryId: $deliveryId) {
      _id
      status
      carrierId
    }
  }
`;

export const ADMIN_UPDATE_DELIVERY_META = gql`
  mutation AdminUpdateDeliveryMeta($input: AdminUpdateDeliveryMetaInput!) {
    adminUpdateDeliveryMeta(input: $input) {
      _id
      visibleToCarriers
      scheduledFor
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      _id
      content
      senderRole
      createdAt
    }
  }
`;

export const CREATE_PROMO_CODE = gql`
  mutation CreatePromoCode($input: CreatePromoCodeInput!) {
    createPromoCode(input: $input) {
      _id
      code
      discountType
      discountValue
      message
      active
    }
  }
`;

export const UPDATE_PROMO_CODE = gql`
  mutation UpdatePromoCode($input: UpdatePromoCodeInput!) {
    updatePromoCode(input: $input) {
      _id
      code
      discountType
      discountValue
      message
      active
    }
  }
`;

export const SET_PROMO_ACTIVE = gql`
  mutation SetPromoCodeActive($id: String!, $active: Boolean!) {
    setPromoCodeActive(id: $id, active: $active) {
      _id
      active
    }
  }
`;

export const DELETE_PROMO_CODE = gql`
  mutation DeletePromoCode($id: String!) {
    deletePromoCode(id: $id)
  }
`;

export const UPDATE_PRICING_SETTINGS = gql`
  mutation UpdatePricingSettings($input: UpdatePricingSettingsInput!) {
    updatePricingSettings(input: $input) {
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

export const ADMIN_BROADCAST = gql`
  mutation AdminBroadcastNotification($input: AdminBroadcastInput!) {
    adminBroadcastNotification(input: $input) {
      ok
      rolesTargeted
    }
  }
`;
