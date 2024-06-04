import { DetailedErrorResponse } from "./DetailedErrorResponse";
import type { User } from "./User";

 export type UserMeRetrieve200 = User;
export type UserMeRetrieve403 = DetailedErrorResponse;
export type UserMeRetrieveQueryResponse = User;
export type UserMeRetrieveQuery = {
    Response: UserMeRetrieveQueryResponse;
    Errors: UserMeRetrieve403;
};