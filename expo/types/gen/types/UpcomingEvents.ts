import type { Event } from "./Event";

 export type UpcomingEventsQueryParams = {
    /**
     * @description Distance in km from user\'s last known location
     * @type integer | undefined
    */
    distance?: number;
};
export type UpcomingEvents200 = Event[];
export type UpcomingEventsQueryResponse = Event[];
export type UpcomingEventsQuery = {
    Response: UpcomingEventsQueryResponse;
    QueryParams: UpcomingEventsQueryParams;
};