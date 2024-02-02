import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe.only("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                $schema: "https://json-schema.org/draft/draft-04/schema",
                type: "object",
                properties: {
                    name: { type: "string" },
                    age: {
                        type: "string",
                    },
                    c: { $ref: "#" },
                },
                dependencies: {
                    age: ["name"],
                },
                required: [],
            },
            "draft-04",
        );

        const result = validator.validate({ name1: "1333", age: "222" });
        console.log(JSON.stringify(result));
    });
});
