import * as SecureStore from "expo-secure-store";

const REFRESH_TOKEN_KEY = "auth.refresh-token";

type AuthToken = string | null;

let accessToken: AuthToken = null;
let refreshToken: AuthToken = null;

export function getAccessToken(): AuthToken {
  return accessToken;
}

export function setAccessToken(token: AuthToken) {
  accessToken = token;
  return accessToken;
}

export async function getRefreshToken(): Promise<string | null> {
  refreshToken ??= await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  return refreshToken;
}

export async function setRefreshToken(token: AuthToken) {
  if (token === null) {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    return;
  }

  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function clearAuthTokens() {
  setAccessToken(null);
  await setRefreshToken(null);
}
