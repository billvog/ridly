import { DetailedErrorResponse } from "./DetailedErrorResponse";
import type { User } from "./User";

 export type UserMe200 = User;
export type UserMe403 = DetailedErrorResponse;
export type UserMeQueryResponse = User;
export type UserMeQuery = {
    Response: UserMeQueryResponse;
    Errors: UserMe403;
};