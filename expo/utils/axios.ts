import { axiosInstance } from "@kubb/swagger-client/client";
import * as AuthTokens from "@/utils/authTokens";

// Configure axios instance
axiosInstance.defaults.baseURL = `http://${process.env.EXPO_PUBLIC_API_HOST}`;
axiosInstance.defaults.withCredentials = true;

// Put access and refresh token, if any, in the request headers, for every request.
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = AuthTokens.getAccessToken();
  const refreshToken = await AuthTokens.getRefreshToken();

  config.headers["x-access-token"] = accessToken;
  config.headers["x-refresh-token"] = refreshToken;

  return config;
});

// If a new access or refresh token is returned in the response, update the stored access token.
axiosInstance.interceptors.response.use((response) => {
  const newAccessToken = response.headers["x-access-token"];
  if (newAccessToken) {
    AuthTokens.setAccessToken(newAccessToken);
  }

  const newRefreshToken = response.headers["x-refresh-token"];
  if (newRefreshToken) {
    AuthTokens.setRefreshToken(newRefreshToken);
  }

  return response;
});
