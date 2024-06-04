export type HuntEvent = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    location_name: string;
    /**
     * @type object
    */
    location_coordinates: {
        /**
         * @type number | undefined, float
        */
        long?: number;
        /**
         * @type number | undefined, float
        */
        lat?: number;
    };
};