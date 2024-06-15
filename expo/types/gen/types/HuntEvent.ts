import { Point } from "./Point";

 export type HuntEvent = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type string
    */
    location_name: string;
    location_coordinates: Point;
};