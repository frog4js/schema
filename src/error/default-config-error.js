export class DefaultConfigError extends Error {
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
        super("default config is invalid");
        this.errors = errors;
        this.name = "DefaultConfigError";
    }
}
