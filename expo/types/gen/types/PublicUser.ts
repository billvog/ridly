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
     * @type string, uri
    */
    avatar_url: string;
};