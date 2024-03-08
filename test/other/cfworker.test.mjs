import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe.only("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const schema = {
            properties: {
                __proto__: {
                    type: "number",
                },
                toString: {
                    properties: {
                        length: {
                            type: "string",
                        },
                    },
                },
                constructor: {
                    type: "number",
                },
            },
        };
        const data = {};

        const validator = new Validator(schema, "draft-04");
        const result = validator.validate(data);
        console.log("hyprtjump", JSON.stringify(result));
    });
});
