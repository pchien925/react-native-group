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

  interface ILogin {
    accessToken: string;
    refreshToken: string;
    userId: number;
  }

  interface IRegister {
    id: number;
    email: string;
    password: string;
    phone: string;
    lastName: string;
    firstName: string;
    dob: Date;
    gender: string;
    status: string;
  }

  interface IForgotPassword {
    email: string;
  }

  interface IVerify {
    email: string;
    code: string;
  }

  interface IResetPassword {
    email: string;
    code: string;
  }

  interface IChangePassword {
    email: string;
    password: string;
    confirmPassword: string;
  }

  interface IMenuItem {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    imageUrl: string;
    optionTypes?: IOptionType[];
  }

  interface IMenuCategory {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
  }

  interface IOptionType {
    id: number;
    name: string;
    description: string;
    optionValues: IOptionValue[];
  }

  interface IOptionValue {
    id: number;
    name: string;
    description: string;
    extraCost: number;
    available: boolean;
  }
}
