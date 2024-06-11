import { DetailedError } from "./DetailedError";

 /**
 * @description No response body
*/
export type UserLogout204 = any;
export type UserLogout403 = DetailedError;
export type UserLogoutMutationResponse = any;
export type UserLogoutMutation = {
    Response: UserLogoutMutationResponse;
    Errors: UserLogout403;
};