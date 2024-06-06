import { axiosInstance } from "@kubb/swagger-client/client";
import { getAccessToken, setAccessToken } from "@/utils/authTokens";

// Configure axios instance
axiosInstance.defaults.baseURL = `http://${process.env.EXPO_PUBLIC_API_HOST}`;
axiosInstance.defaults.withCredentials = true;

// Put access token, if any, in the request headers, for every request.
axiosInstance.interceptors.request.use((config) => {
  config.headers["x-access-token"] = getAccessToken();
  return config;
});

// If a new access token is returned in the response, update the stored access token.
axiosInstance.interceptors.response.use((response) => {
  const newAccessToken = response.headers["x-access-token"];
  if (newAccessToken) {
    setAccessToken(newAccessToken);
  }

  return response;
});
