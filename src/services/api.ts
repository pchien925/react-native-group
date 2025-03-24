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

export const getMenuItemsApi = (
  page: number,
  size: number,
  sort: string,
  direction: string
) => {
  const url = `/api/v1/menu-items?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IMenuItem>>>(url);
};

export const getMenuCategoriesApi = (
  page: number,
  size: number,
  sort: string,
  direction: string
) => {
  const url = `/api/v1/menu-categories?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IMenuCategory>>>(url);
};

export const getMenuItemOptionTypesApi = (menuItemId: Number) => {
  const url = `/api/v1/menu-items/${menuItemId}/option-types`;
  return axios.get<IBackendResponse<IOptionType[]>>(url);
};

export const getMenuItemByMenuCategoryApi = (
  categoryId: number,
  page: number,
  size: number,
  sort: string,
  direction: string
) => {
  const url = `/api/v1/menu-categories/${categoryId}/menu-items?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IMenuItem>>>(url);
};
