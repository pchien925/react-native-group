// services/refreshTokenApi.ts
import axios from "axios"; // Import trực tiếp từ axios, không qua axios.instance

export const refreshTokenApi = (
  refreshToken: string
): Promise<IBackendResponse<ILoginResponse>> => {
  const url = `/api/v1/auth/refresh-token`;
  const data = {
    refreshToken,
  };
  return axios.post<IBackendResponse<ILoginResponse>>(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
