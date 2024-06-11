import { DetailedError } from "./DetailedError";
import type { User } from "./User";

 export type UserMe200 = User;
export type UserMe403 = DetailedError;
export type UserMeQueryResponse = User;
export type UserMeQuery = {
    Response: UserMeQueryResponse;
    Errors: UserMe403;
};