import { DetailedError } from "./DetailedError";
import { PatchedUpdateUserProfile } from "./PatchedUpdateUserProfile";

 export type UpdateUserProfile = {
    /**
     * @type string | undefined
    */
    bio?: string;
};

 export type UpdateUserProfile200 = UpdateUserProfile;
export type UpdateUserProfile403 = DetailedError;
export type UpdateUserProfileMutationRequest = PatchedUpdateUserProfile;
export type UpdateUserProfileMutationResponse = UpdateUserProfile;
export type UpdateUserProfileMutation = {
    Response: UpdateUserProfileMutationResponse;
    Request: UpdateUserProfileMutationRequest;
    Errors: UpdateUserProfile403;
};