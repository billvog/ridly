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
     * @type boolean
    */
    readonly follow_status: boolean;
};