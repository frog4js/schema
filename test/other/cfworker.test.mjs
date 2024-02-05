import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                $schema: "https://json-schema.org/draft/draft-04/schema",

                type: "number",
                allOf: [{ maximum: 3 }, { type: "integer" }],
                definitions: {
                    a: {
                        b: {
                            c: {
                                type: "string",
                                d: {
                                    type: "number",
                                },
                            },
                        },
                    },
                },
            },
            "draft-04",
        );

        const result = validator.validate(4);
        console.log("hyprtjump", JSON.stringify(result));
    });
});
