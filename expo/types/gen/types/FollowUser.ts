import type { DetailedError } from "./DetailedError";

 export type FollowUser = {
    /**
     * @type integer | undefined
    */
    follower_count?: number;
    /**
     * @type integer | undefined
    */
    following_count?: number;
    /**
     * @type boolean
    */
    follow_status: boolean;
};

 export type FollowUserPathParams = {
    /**
     * @description User Id to follow or unfollow
     * @type string, uuid
    */
    id: string;
};
export type FollowUser200 = FollowUser;
export type FollowUser403 = DetailedError;
export type FollowUser404 = DetailedError;
export type FollowUserMutationResponse = FollowUser;
export type FollowUserMutation = {
    Response: FollowUserMutationResponse;
    PathParams: FollowUserPathParams;
    Errors: FollowUser403 | FollowUser404;
};