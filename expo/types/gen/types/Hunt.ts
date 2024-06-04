import { HuntEvent } from "./HuntEvent";

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