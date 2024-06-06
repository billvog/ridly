import type { Event } from "./Event";

 export type Events200 = Event[];
export type EventsQueryResponse = Event[];
export type EventsQuery = {
    Response: EventsQueryResponse;
};