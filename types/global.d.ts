export {};

declare global {
  interface IBackendResponse<T> {
    error?: string | string[];
    status: number | string;
    message: string;
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
    isActive: boolean;
    operatingHours: string;
  }

  interface IOption {
    id: number;
    name: string;
    description: string;
    IOptionValues: IOptionValue[];
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
    options: IOptionValue[];
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
    item: IMenuItem;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    options: IOrderOption[];
  }

  interface IOrderSummary {
    id: number;
    userInfo: IUserInfo;
    orderCode: string;
    orderStatus: string;
    totalPrice: number;
    branchName: string;
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
    paymentStatus: string;
    transactionCode: string;
    paidAt: string;
    amount: number;
  }
  interface IShipmentTrackingEvent {
    id: number;
    deliveryStatus: string;
    note: string;
    eventTime: string;
    locationLatitude: number;
    locationLongitude: number;
  }

  interface IShipmentInfo {
    id: number;
    deliveryStatus: string;
    trackingHistory: IShipmentTrackingEvent[];
  }

  interface IOrderDetail {
    id: number;
    orderCode: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    note: string;
    shippingAddress: string;
    paymentMethod: string;
    userInfo: IUserInfo;
    branchInfo: IBranchInfo;
    items: IOrderItem[];
    paymentInfo?: IPaymentInfo[];
    shipmentInfo?: IShipmentInfo[];
    pointsEarnedOrSpent?: number;
    loyaltyTransactionDescription?: string;
  }
}
