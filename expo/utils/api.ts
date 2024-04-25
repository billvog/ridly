import { getAccessToken, setAccessToken } from "./authTokens";

const API_BASE_URL = "http://localhost:8000";

type Method = "GET" | "POST" | "DELETE" | "UPDATE" | "PUT" | "PATCH";

export type APIResponse<Data = any> = {
  status: number;
  ok: boolean;
  data: Data;
  headers: Headers;
};

const updateAuthTokenFromResponseHeader = (headers: Headers) => {
  const newAccessToken = headers.get("x-access-token");
  if (newAccessToken) {
    setAccessToken(newAccessToken);
  }
};

export const api = async <Data = any>(
  url: string,
  method: Method = "GET",
  body: object | null = null
): Promise<APIResponse<Data>> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  let accessToken = getAccessToken();
  headers["x-access-token"] = accessToken;

  const response = await fetch(API_BASE_URL + url, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers,
    credentials: "include",
  });

  if (response.status >= 500) {
    throw new Error("Internal server error.");
  }

  const data = method === "DELETE" ? null : await response.json();
  const resHeaders = response.headers;

  updateAuthTokenFromResponseHeader(resHeaders);

  return {
    status: response.status,
    ok: response.status >= 200 && response.status < 300,
    data,
    headers: resHeaders,
  };
};
