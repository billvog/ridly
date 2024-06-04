import type { EventJoin } from "./EventJoin";

 export type EventJoinCreatePathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type EventJoinCreate200 = EventJoin;
export type EventJoinCreateMutationResponse = EventJoin;
export type EventJoinCreateMutation = {
    Response: EventJoinCreateMutationResponse;
    PathParams: EventJoinCreatePathParams;
};