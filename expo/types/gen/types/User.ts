import { UserProfile } from "./UserProfile";

 /**
 * @description Inherits `PublicUserSerializer` and adds fields that are only available to the user themselves.
*/
export type User = {
    /**
     * @type string, uuid
    */
    readonly id: string;
    /**
     * @type string
    */
    first_name: string;
    /**
     * @type string
    */
    last_name: string;
    /**
     * @type string
    */
    username: string;
    /**
     * @type boolean | undefined
    */
    is_creator?: boolean;
    /**
     * @type string, uri
    */
    avatar_url: string;
    profile: UserProfile;
    /**
     * @type string, email
    */
    email: string;
    /**
     * @type boolean | undefined
    */
    did_complete_signup?: boolean;
    /**
     * @type string, date-time
    */
    readonly created_at: string;
};