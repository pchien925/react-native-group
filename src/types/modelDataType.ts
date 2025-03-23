export {};

declare global {
  interface IBackendResponse<T> {
    error?: string | string[];
    status: number | string;
    message: string;
    data?: T;
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
}
