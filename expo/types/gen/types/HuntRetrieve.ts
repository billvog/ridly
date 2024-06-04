import type { Hunt } from "./Hunt";

 export type HuntRetrievePathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};
export type HuntRetrieve200 = Hunt;
export type HuntRetrieveQueryResponse = Hunt;
export type HuntRetrieveQuery = {
    Response: HuntRetrieveQueryResponse;
    PathParams: HuntRetrievePathParams;
};