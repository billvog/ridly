// Init dayjs plugins
import "@/utils/dayjs";

import { Providers } from "@/modules/Providers";
import { getAccessToken } from "@/utils/authTokens";
import { axiosInstance } from "@kubb/swagger-client/client";
import { Slot } from "expo-router";
import React from "react";

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = `http://${process.env.EXPO_PUBLIC_API_HOST}`;

  const accessToken = getAccessToken();
  if (accessToken && config.headers) {
    config.headers["x-access-token"] = accessToken;
  }

  return config;
});

export default function Layout() {
  return (
    <Providers>
      <Slot />
    </Providers>
  );
}
