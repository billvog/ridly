import { HuntEvent } from "./HuntEvent";
import { DetailedErrorResponse } from "./DetailedErrorResponse";

 export type Hunt = {
    /**
     * @type string, uuid
    */
    readonly id: string;
    event: HuntEvent;
    /**
     * @type integer
    */
    readonly clue_count: number;
};

 export type HuntPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type Hunt200 = Hunt;
export type Hunt404 = DetailedErrorResponse;
export type HuntQueryResponse = Hunt;
export type HuntQuery = {
    Response: HuntQueryResponse;
    PathParams: HuntPathParams;
    Errors: Hunt404;
};