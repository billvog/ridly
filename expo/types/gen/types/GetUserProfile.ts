import { UserWithProfile } from "./UserWithProfile";
import { MiniEvent } from "./MiniEvent";
import { DetailedError } from "./DetailedError";

 export type GetUserProfile = {
    user: UserWithProfile;
    /**
     * @type array
    */
    joined_events: MiniEvent[];
};

 export type GetUserProfilePathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type GetUserProfile200 = GetUserProfile;
export type GetUserProfile404 = DetailedError;
export type GetUserProfileQueryResponse = GetUserProfile;
export type GetUserProfileQuery = {
    Response: GetUserProfileQueryResponse;
    PathParams: GetUserProfilePathParams;
    Errors: GetUserProfile404;
};