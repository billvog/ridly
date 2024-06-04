import type { HuntClue } from "./HuntClue";

 export type HuntClueRetrievePathParams = {
    /**
     * @type integer
    */
    clue_order: number;
    /**
     * @type string, uuid
    */
    id: string;
};
export type HuntClueRetrieve200 = HuntClue;
export type HuntClueRetrieveQueryResponse = HuntClue;
export type HuntClueRetrieveQuery = {
    Response: HuntClueRetrieveQueryResponse;
    PathParams: HuntClueRetrievePathParams;
};