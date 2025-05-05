// services/axios.instance.ts
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleApiError } from "@/utils/error.handler";

const backendUrl =
  Platform.OS === "ios" ? "http://172.20.10.3:9990" : "http://172.20.10.3:9990";

const instance = axios.create({
  baseURL: "http://172.17.15.48:9990",
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm getter để lấy refreshTokenApi
const getRefreshTokenApi = async () => {
  const { refreshTokenApi } = await import("./api");
  return refreshTokenApi;
};

instance.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    if (response.data) return response.data;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshTokenApi = await getRefreshTokenApi();
          const response = await refreshTokenApi(refreshToken);
          const data = await handleApiError(
            response,
            "Failed to refresh token"
          );
          await AsyncStorage.setItem("accessToken", data.accessToken);
          await AsyncStorage.setItem("refreshToken", data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        return Promise.reject({
          error: "Unable to refresh token",
          status: 401,
          message: "Please log in again",
        });
      }
    }
    if (error?.response?.data) {
      return error.response.data; // IBackendResponse<T>
    }
    return Promise.reject({
      error: "Network error or server unreachable",
      status: error.response?.status || 500,
      message: error.message || "An error occurred",
    });
  }
);

export default instance;
