// utils/errorHandler.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const handleApiError = async <T>(
  response: IBackendResponse<T>,
  defaultMessage: string
): Promise<T> => {
  if (response.error || !response.data) {
    if (
      response.error &&
      typeof response.error === "string" &&
      response.error.toLowerCase().includes("current user not found")
    ) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      router.replace("/login");
    }
    throw new Error(
      typeof response.error === "string"
        ? response.error
        : Array.isArray(response.error)
        ? response.error.join(", ")
        : response.message || defaultMessage
    );
  }
  return response.data;
};
