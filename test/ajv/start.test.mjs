import { describe, it, beforeEach } from "node:test";
import Ajv from "ajv";
import addFormats from "ajv-formats";

describe("test the ajv", () => {
    it("should succeed when using default parameters", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });
        addFormats(ajv);

        const schema = {
            type: "array",
            items: { type: "object", properties: { name: { type: "string" } } },
        };

        const data = [{ name: 1 }, { name: 2 }];

        const validate = ajv.compile(schema);

        console.log(validate(data)); // true
        console.log(validate.errors); // true
        console.log(data); // { "foo": 1, "bar": "baz" }
    });
});
