export class SchemaInvalidError extends Error {
    /**
     * @type {string}
     */
    name;
    /**
     * @type {Array}
     */
    errors;

    /**
     *
     * @param errors
     */
    constructor(errors) {
        super("schema is invalid");
        this.errors = errors;
        this.name = "SchemaInvalidError";
    }
}
