import { DetailedErrorResponse } from "./DetailedErrorResponse";
import { Login } from "./Login";
import type { User } from "./User";

 export type OauthGoogleLogin200 = User;
export type OauthGoogleLogin400 = DetailedErrorResponse;
export type OauthGoogleLoginMutationRequest = Login;
export type OauthGoogleLoginMutationResponse = User;
export type OauthGoogleLoginMutation = {
    Response: OauthGoogleLoginMutationResponse;
    Request: OauthGoogleLoginMutationRequest;
    Errors: OauthGoogleLogin400;
};