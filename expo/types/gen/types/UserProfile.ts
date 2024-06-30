export type UserProfile = {
    /**
     * @type string | undefined
    */
    bio?: string;
    /**
     * @type integer | undefined
    */
    follower_count?: number;
    /**
     * @type integer | undefined
    */
    following_count?: number;
    /**
     * @description Indicated whether the logged in user, if any, is following the requested user.
     * @type boolean
    */
    readonly follow_status: boolean;
};