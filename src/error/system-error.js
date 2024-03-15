export class SystemError extends Error {
    /**
     * @type {string}
     */
    name;

    constructor(message) {
        super("system error: " + message);
        this.name = "SystemError";
    }
}
