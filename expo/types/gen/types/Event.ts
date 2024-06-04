import { Creator } from "./Creator";
import { EventParticipant } from "./EventParticipant";

 export type Event = {
    /**
     * @type string, uuid
    */
    readonly id: string;
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    description: string;
    creator: Creator;
    /**
     * @type array
    */
    readonly participants: EventParticipant[];
    /**
     * @type integer | undefined
    */
    participant_count?: number;
    /**
     * @type boolean
    */
    readonly has_joined: boolean;
    /**
     * @type string
    */
    location_name: string;
    /**
     * @type string, date-time
    */
    happening_at: string;
    /**
     * @type string, uuid
    */
    readonly hunt_id: string;
    /**
     * @type string, date-time
    */
    readonly created_at: string;
};