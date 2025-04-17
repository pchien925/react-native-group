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
}
