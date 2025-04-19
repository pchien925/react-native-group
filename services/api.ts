import axios from "@/services/axios.instance";

export const getMenuItemsByCategoryApi = (
  categoryId: number,
  page: number,
  size: number,
  sort: string = "id",
  direction: string = "asc"
) => {
  const url = `/api/v1/menu-items?categoryId=${categoryId}&page=${page}&size=${size}&sort=${sort},${direction}`;
  return axios.get<IBackendResponse<IPaginationData<IMenuItem>>>(url);
};

export const getOptionsByMenuItemApi = (menuItemId: number) => {
  const url = `/api/v1/menu-items/${menuItemId}/options`;
  return axios.get<IBackendResponse<IOption[]>>(url);
};
