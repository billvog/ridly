import { Creator } from "./Creator";
import { DetailedError } from "./DetailedError";

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
     * @description Get the first 3 participants\' avatars, excluding the logged in user and users without avatars.
     * @type array
    */
    readonly participant_avatars: string[];
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
    hunt_id: string;
    /**
     * @type string, date-time
    */
    readonly created_at: string;
};

 export type EventPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type Event200 = Event;
export type Event404 = DetailedError;
export type EventQueryResponse = Event;
export type EventQuery = {
    Response: EventQueryResponse;
    PathParams: EventPathParams;
    Errors: Event404;
};