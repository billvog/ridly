import { DetailedError } from "./DetailedError";
import type { Event } from "./Event";

 export type JoinedEvents200 = Event[];
export type JoinedEvents403 = DetailedError;
export type JoinedEventsQueryResponse = Event[];
export type JoinedEventsQuery = {
    Response: JoinedEventsQueryResponse;
    Errors: JoinedEvents403;
};