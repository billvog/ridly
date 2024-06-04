import { PublicUser } from "./PublicUser";

 export type Creator = {
    /**
     * @type string, uuid
    */
    readonly id: string;
    user: PublicUser;
};