import { DetailedErrorResponse } from "./DetailedErrorResponse";

 /**
 * @description No response body
*/
export type UserLogout204 = any;
export type UserLogout403 = DetailedErrorResponse;
export type UserLogoutMutationResponse = any;
export type UserLogoutMutation = {
    Response: UserLogoutMutationResponse;
    Errors: UserLogout403;
};