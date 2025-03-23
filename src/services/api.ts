import axios from "@/src/services/axiosInstance";

export const loginApi = (email: string, password: string) => {
  const url = `/api/v1/auth/login`;
  return axios.post<IBackendResponse<ILogin>>(url, { email, password });
};

export const registerApi = (
  email: string,
  password: string,
  phone: string,
  fullName: string,
  dob: string,
  gender: string
) => {
  const url = `/api/v1/auth/register`;
  return axios.post<IBackendResponse<IRegister>>(url, {
    email,
    password,
    phone,
    fullName,
    dob,
    gender,
  });
};

export const verifyApi = (email: string, code: string) => {
  const url = `/api/v1/auth/verify`;
  return axios.post<IBackendResponse<IVerify>>(url, { email, code });
};

export const forgotPasswordApi = (email: string) => {
  const url = `/api/v1/auth/verify`;
  return axios.post<IBackendResponse<IForgotPassword>>(url, { email });
};

export const resetPasswordApi = (email: string, code: string) => {
  const url = `/api/v1/auth/reset-password`;
  return axios.post<IBackendResponse<IResetPassword>>(url, { email, code });
};

export const changePasswordApi = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const url = `/api/v1/auth/change-password`;
  return axios.post<IBackendResponse<IChangePassword>>(url, {
    email,
    password,
    confirmPassword,
  });
};
