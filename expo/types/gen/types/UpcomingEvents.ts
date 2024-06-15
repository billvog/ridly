import type { Event } from "./Event";

 export type UpcomingEvents200 = Event[];
export type UpcomingEventsQueryResponse = Event[];
export type UpcomingEventsQuery = {
    Response: UpcomingEventsQueryResponse;
};