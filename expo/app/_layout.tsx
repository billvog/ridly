// Init dayjs plugins
import "@/utils/dayjs";

import { Providers } from "@/modules/Providers";
import { getAccessToken } from "@/utils/authTokens";
import { axiosInstance } from "@kubb/swagger-client/client";
import { Slot } from "expo-router";
import React from "react";

// Configure axios instance
axiosInstance.interceptors.request.use((config) => {
  config.baseURL = `http://${process.env.EXPO_PUBLIC_API_HOST}`;
  config.withCredentials = true;

  const accessToken = getAccessToken();
  config.headers["x-access-token"] = accessToken;

  return config;
});

export default function Layout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
