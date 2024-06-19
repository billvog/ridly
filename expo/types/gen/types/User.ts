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
     * @type string, email
    */
    email: string;
    /**
     * @type string, uri
    */
    avatar_url: string;
    /**
     * @type boolean | undefined
    */
    did_complete_signup?: boolean;
    /**
     * @type string, date-time
    */
    readonly created_at: string;
};