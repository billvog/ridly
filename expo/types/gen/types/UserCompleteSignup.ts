import { ValidationError } from "./ValidationError";
import { DetailedErrorResponse } from "./DetailedErrorResponse";
import type { CompleteSignup } from "./CompleteSignup";

 export type UserCompleteSignup200 = CompleteSignup;
export type UserCompleteSignup400 = ValidationError;
export type UserCompleteSignup403 = DetailedErrorResponse;
export type UserCompleteSignupMutationRequest = Omit<NonNullable<CompleteSignup>, "did_complete_signup">;
export type UserCompleteSignupMutationResponse = CompleteSignup;
export type UserCompleteSignupMutation = {
    Response: UserCompleteSignupMutationResponse;
    Request: UserCompleteSignupMutationRequest;
    Errors: UserCompleteSignup400 | UserCompleteSignup403;
};