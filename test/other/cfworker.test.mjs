import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                properties: {
                    foo: {},
                    bar: {},
                },
                patternProperties: {
                    "^v": {},
                },
                additionalProperties: false,
            },
            "draft-04",
        );
        const data = {
            foo: 1,
            vroom: 2,
        };
        const result = validator.validate(data);
        console.log(data.name);
        console.log("hyprtjump", JSON.stringify(result));
    });
});
