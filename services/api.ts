// services/api.ts
import axios from "./axios.instance";

export const refreshTokenApi = (
  refreshToken: string
): Promise<IBackendResponse<ILoginResponse>> => {
  const url = `/api/v1/auth/refresh-token`;
  return axios.post(url, { refreshToken });
};

export const getMenuItemsByCategoryApi = (
  categoryId: number,
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
): Promise<IBackendResponse<IPaginationData<IMenuItem>>> => {
  const url = `/api/v1/menu-categories/${categoryId}/menu-items?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get(url);
};

export const getOptionsByMenuItemApi = (
  menuItemId: number
): Promise<IBackendResponse<IOption[]>> => {
  const url = `/api/v1/menu-items/${menuItemId}/options`;
  return axios.get(url);
};

export const getBranchesApi = (
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
): Promise<IBackendResponse<IPaginationData<IBranch>>> => {
  const url = `/api/v1/branches?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get(url);
};

export const getAllBranchesApi = (): Promise<IBackendResponse<IBranch[]>> => {
  const url = `/api/v1/branches/all`;
  return axios.get(url);
};

export const createOrderApi = (
  userId: number,
  branchId: number,
  shippingAddress: string,
  note: string,
  paymentMethod: "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD"
): Promise<IBackendResponse<IOrderInfo>> => {
  const url = `/api/v1/orders?userId=${userId}`;
  const data = { branchId, shippingAddress, note, paymentMethod };
  return axios.post(url, data);
};

export const getMenuCategoriesApi = (): Promise<
  IBackendResponse<IMenuCategory[]>
> => {
  const url = `/api/v1/menu-categories/all`;
  return axios.get(url);
};

export const getMenuItemsApi = (
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
): Promise<IBackendResponse<IPaginationData<IMenuItem>>> => {
  const url = `/api/v1/menu-items?page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get(url);
};

export const loginApi = (
  email: string,
  password: string
): Promise<IBackendResponse<ILoginResponse>> => {
  const url = `/api/v1/auth/sign-in`;
  const data = { email, password };
  return axios.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getCurrentUserApi = (): Promise<IBackendResponse<IUser>> => {
  const url = `/api/v1/users/me`;
  return axios.get(url);
};

//cart
export const getCartApi = (): Promise<IBackendResponse<ICart>> => {
  const url = `/api/v1/carts`;
  return axios.get(url);
};

export const addItemToCartApi = (
  menuItemId: number,
  quantity: number,
  options: IOptionValue[]
): Promise<IBackendResponse<ICart>> => {
  const url = `/api/v1/carts/items`;
  const data = {
    menuItemId,
    quantity,
    selectedMenuItemOptionIds: options.map((option) => option.id),
  };
  return axios.post(url, data);
};

export const updateItemQuantityApi = (
  cartItemId: number,
  quantity: number
): Promise<IBackendResponse<ICart>> => {
  const url = `/api/v1/carts/items/${cartItemId}`;
  const data = { quantity };
  return axios.patch(url, data);
};

export const removeItemFromCartApi = (
  cartItemId: number
): Promise<IBackendResponse<ICart>> => {
  const url = `/api/v1/carts/items/${cartItemId}`;
  return axios.delete(url);
};

export const getCartItemsApi = (): Promise<IBackendResponse<ICartItem[]>> => {
  const url = `/api/v1/carts/items`;
  return axios.get(url);
};

export const clearCartApi = (): Promise<IBackendResponse<ICart>> => {
  const url = `/api/v1/carts`;
  return axios.delete(url);
};

export const getMenuItemOptionsApi = (
  menuItemId: number
): Promise<IBackendResponse<IOption[]>> => {
  const url = `/api/v1/menu-items/${menuItemId}/options`;
  return axios.get(url);
};

export const getMenuItemByIdApi = (
  menuItemId: number
): Promise<IBackendResponse<IMenuItem>> => {
  const url = `/api/v1/menu-items/${menuItemId}`;
  return axios.get(url);
};

export const getUserOrdersApi = (
  userId: number,
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "desc"
): Promise<IBackendResponse<IPaginationData<IOrderInfo>>> => {
  const url = `/api/v1/orders?userId=${userId}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`;
  return axios.get(url);
};

export const getOrderByIdApi = (
  orderId: number,
  userId: number
): Promise<IBackendResponse<IOrderDetail>> => {
  const url = `/api/v1/orders/${orderId}?userId=${userId}`;
  return axios.get(url);
};

export const cancelOrderApi = (
  orderId: number,
  userId: number
): Promise<IBackendResponse<IOrderInfo>> => {
  const url = `/api/v1/orders/${orderId}/cancel?userId=${userId}`;
  return axios.patch(url);
};
