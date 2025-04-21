import axios from "@/services/axios.instance";

export const getMenuItemsByCategoryApi = (
  categoryId: number,
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
) => {
  const url = `/api/v1/menu-items?categoryId=${categoryId}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IMenuItem>>>(url);
};

export const getOptionsByMenuItemApi = (menuItemId: number) => {
  const url = `/api/v1/menu-items/${menuItemId}/options`;
  return axios.get<IBackendResponse<IOption[]>>(url);
};

export const getBranchesApi = (
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
) => {
  const url = `/api/v1/branches?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IBranch>>>(url);
};

export const createOrderApi = (
  userId: number,
  branchId: number,
  shippingAddress: string,
  note: string,
  paymentMethod: "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD"
) => {
  const url = `/api/v1/orders`;
  const data = {
    userId,
    branchId,
    shippingAddress,
    note,
    paymentMethod,
  };
  return axios.post<IBackendResponse<IOrderInfo>>(url, data);
};

export const getMenuCategoriesApi = () => {
  const url = `/api/v1/menu-categories/all`;
  return axios.get<IBackendResponse<IMenuCategory[]>>(url);
};

export const getMenuItemsApi = (
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
) => {
  const url = `/api/v1/menu-items?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IMenuItem>>>(url);
};

export const loginApi = (email: string, password: string) => {
  const url = `/api/v1/auth/sign-in`;
  const data = {
    email,
    password,
  };
  return axios.post<IBackendResponse<ILoginResponse>>(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCurrentUserApi = () => {
  const url = `/api/v1/users/me`;
  return axios.get<IBackendResponse<IUser>>(url);
};

export const getCartApi = () => {
  const url = `/api/v1/carts`;
  return axios.get<IBackendResponse<ICart>>(url);
};

export const addItemToCartApi = (
  menuItemId: number,
  quantity: number,
  options: IOptionValue[]
) => {
  const url = `/api/v1/carts`;
  const data = {
    menuItemId,
    quantity,
    selectedMenuItemOptionIds: options.map((option) => option.id),
  };
  return axios.post<IBackendResponse<ICart>>(url, data);
};

export const updateQuantityApi = (cartItemId: number, quantity: number) => {
  const url = `/api/v1/carts/${cartItemId}`;
  const data = {
    quantity,
  };
  return axios.put<IBackendResponse<ICartItem>>(url, data);
};

export const removeItemFromCartApi = (cartItemId: number) => {
  const url = `/api/v1/carts/${cartItemId}`;
  return axios.delete<IBackendResponse<ICartItem>>(url);
};
