import { UserProfile } from "./UserProfile";

 /**
 * @description User serializer that is available to the public.
*/
export type PublicUser = {
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
};