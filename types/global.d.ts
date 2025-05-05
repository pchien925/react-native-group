export {};

declare global {
  interface IBackendResponse<T> {
    error?: string | string[];
    status: number | string;
    message?: string;
    data?: T;
  }

  interface IPaginationData<T> {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    content: T[];
  }

  interface IMenuItem {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    basePrice: number;
  }

  interface IMenuCategory {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  }

  interface IBranch {
    id: number;
    name: string;
    address: string;
    phone: string;
    active: boolean;
    operatingHours: string;
  }

  interface IOption {
    id: number;
    name: string;
    description: string;
    menuItemOption: IOptionValue[];
  }

  interface IOptionValue {
    id: number;
    value: string;
    additionalPrice: number;
  }

  interface ICartItem {
    id: number;
    quantity: number;
    priceAtAddition: number;
    menuItem: IMenuItem;
    selectedOptions: IOptionValue[];
  }

  interface ICart {
    id: number;
    cartItems: ICartItem[];
    totalPrice: number;
  }

  interface IOrderOption {
    id: number;
    optionName: string;
    optionValue: string;
    additionalPrice: number;
  }

  interface IOrderItem {
    id: number;
    menuItem: IMenuItem;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    options: IOrderOption[];
  }

  interface IOrderInfo {
    id: number;
    orderCode: string;
    orderStatus: "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
    totalPrice: number;
    shippingAddress: string;
    paymentMethod: "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD";
    shipmentInfo: IShipmentInfo;
    createdAt: string;
    updatedAt: string;
  }

  interface IUserInfo {
    id: number;
    fullName: string;
    email: string;
    phone: string;
  }

  interface IBranchInfo {
    id: number;
    name: string;
    address: string;
    phone: string;
  }

  interface IPaymentInfo {
    id: number;
    paymentMethod: string;
    status: string;
    transactionCode: string;
    paidAt: string;
    amount: number;
  }
  interface IShipmentTrackingEvent {
    id: number;
    deliveryStatus:
      | "PREPARING"
      | "OUT_FOR_DELIVERY"
      | "DELIVERED"
      | "FAILED_ATTEMPT"
      | "ASSIGNED_SHIPPER"
      | "PICKED_UP";
    note: string;
    eventTime: string;
    locationLatitude: number;
    locationLongitude: number;
  }

  interface IShipmentDetail {
    id: number;
    deliveryStatus: string;
    trackingEvents: IShipmentTrackingEvent[];
    createdAt: string;
    updatedAt: string;
  }

  interface IShipmentInfo {
    id: number;
    deliveryStatus: string;

    createdAt: string;
    updatedAt: string;
  }

  interface IOrderDetail {
    id: number;
    orderCode: string;
    totalPrice: number;
    orderStatus: "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
    note: string;
    shippingAddress: string;
    paymentMethod: string;
    user: IUserInfo;
    branch: IBranchInfo;
    items: IOrderItem[];
    payments: IPaymentInfo[];
    shipment: IShipmentDetail;

    createdAt: string;
    updatedAt: string;
  }

  interface IOrderInfo {
    id: number;
    orderCode: string;
    orderStatus: "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED";
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
  }

  interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    userId: number;
  }

  interface IOtpResponse {
    email: string;
    otpExpiry: number;
  }

  interface IVerifyOtpResponse {
    email: string;
    verificationToken: string;
  }

  interface IUser {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    avatar: string | null;
    gender: "MALE" | "FEMALE" | "OTHER";
    address: string;
    status: "ACTIVE" | "INACTIVE";
    loyaltyPointsBalance: number;
  }

  interface INotification {
    id: number;
    title: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
  }
}
