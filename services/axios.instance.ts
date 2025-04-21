// services/axios.instance.ts
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleApiError } from "@/utils/errorHandler";

const backendUrl =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_API_URL
    : process.env.EXPO_PUBLIC_ANDROID_URL;

const instance = axios.create({
  baseURL: backendUrl,
  timeout: 20000,
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
    if (response.data) return response.data; // IBackendResponse<T>
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
