/**
 * @description Event serializer, but with only the necessary fields.
*/
export type MiniEvent = {
    /**
     * @type string, uuid
    */
    readonly id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type boolean
    */
    readonly has_joined: boolean;
    /**
     * @type string
    */
    location_name: string;
    /**
     * @type integer | undefined
    */
    participant_count?: number;
    /**
     * @type string, date-time
    */
    happening_at: string;
};