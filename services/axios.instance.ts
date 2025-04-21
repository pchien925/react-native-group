// services/axios.instance.ts
import axios from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Request interceptor để thêm Authorization header
instance.interceptors.request.use(
  async (config) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    if (response.data) return response.data; // Trả về IBackendResponse
    return response;
  },
  (error) => {
    if (error?.response?.data) {
      return error?.response?.data; // Trả về IBackendResponse
    }
    return Promise.reject(error);
  }
);

export default instance;
