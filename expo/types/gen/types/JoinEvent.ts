import type { DetailedError } from "./DetailedError";
import type { EventJoin } from "./EventJoin";

 export type JoinEventPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type JoinEvent200 = EventJoin;
export type JoinEvent403 = DetailedError;
export type JoinEvent404 = DetailedError;
export type JoinEventMutationResponse = EventJoin;
export type JoinEventMutation = {
    Response: JoinEventMutationResponse;
    PathParams: JoinEventPathParams;
    Errors: JoinEvent403 | JoinEvent404;
};