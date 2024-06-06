import { DetailedErrorResponse } from "./DetailedErrorResponse";

 export type HuntClue = {
    /**
     * @type integer
    */
    readonly id: number;
    /**
     * @type string
    */
    riddle: string;
    /**
     * @type integer | undefined
    */
    order?: number;
    /**
     * @type number | undefined, double
    */
    location_threshold?: number;
};

 export type HuntCluePathParams = {
    /**
     * @type integer
    */
    clue_order: number;
    /**
     * @type string, uuid
    */
    id: string;
};
export type HuntClue200 = HuntClue;
export type HuntClue404 = DetailedErrorResponse;
export type HuntClueQueryResponse = HuntClue;
export type HuntClueQuery = {
    Response: HuntClueQueryResponse;
    PathParams: HuntCluePathParams;
    Errors: HuntClue404;
};