import { ValidationError } from "./ValidationError";
import { DetailedError } from "./DetailedError";
import type { UpdateLastKnownLocation } from "./UpdateLastKnownLocation";

 export type UserUpdateLastKnownLocation200 = UpdateLastKnownLocation;
export type UserUpdateLastKnownLocation400 = ValidationError;
export type UserUpdateLastKnownLocation403 = DetailedError;
export type UserUpdateLastKnownLocationMutationRequest = UpdateLastKnownLocation;
export type UserUpdateLastKnownLocationMutationResponse = UpdateLastKnownLocation;
export type UserUpdateLastKnownLocationMutation = {
    Response: UserUpdateLastKnownLocationMutationResponse;
    Request: UserUpdateLastKnownLocationMutationRequest;
    Errors: UserUpdateLastKnownLocation400 | UserUpdateLastKnownLocation403;
};