import type { Event } from "./Event";

 export type EventRetrievePathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type EventRetrieve200 = Event;
export type EventRetrieveQueryResponse = Event;
export type EventRetrieveQuery = {
    Response: EventRetrieveQueryResponse;
    PathParams: EventRetrievePathParams;
};