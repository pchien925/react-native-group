import axios from "@/src/services/axiosInstance";

export const loginApi = (email: string, password: string) => {
  const url = `/api/v1/auth/login`;
  return axios.post<IBackendResponse<ILogin>>(url, { email, password });
};

export const registerApi = (
  email: string,
  password: string,
  phone: string,
  lastName: string,
  firstName: string,
  dob: Date,
  gender: string
) => {
  const url = `/api/v1/auth/register`;
  return axios.post<IBackendResponse<IRegister>>(url, {
    email,
    password,
    phone,
    lastName,
    firstName,
    dob,
    gender,
  });
};
