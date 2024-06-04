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