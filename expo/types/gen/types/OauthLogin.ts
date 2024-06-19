import { DetailedError } from "./DetailedError";
import { Login } from "./Login";
import type { User } from "./User";

 export const oauthLoginPathParamsProvider = {
    "google": "google"
} as const;
export type OauthLoginPathParamsProvider = (typeof oauthLoginPathParamsProvider)[keyof typeof oauthLoginPathParamsProvider];
export type OauthLoginPathParams = {
    /**
     * @description OAuth provider name
     * @type string
    */
    provider: OauthLoginPathParamsProvider;
};
export type OauthLogin200 = User;
export type OauthLogin400 = DetailedError;
export type OauthLoginMutationRequest = Login;
export type OauthLoginMutationResponse = User;
export type OauthLoginMutation = {
    Response: OauthLoginMutationResponse;
    Request: OauthLoginMutationRequest;
    PathParams: OauthLoginPathParams;
    Errors: OauthLogin400;
};