export type ValidationError = {
    /**
     * @type object
    */
    errors: {
        [key: string]: string[];
    };
};