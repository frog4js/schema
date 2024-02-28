import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                $schema: "https://json-schema.org/draft/draft-06/schema",
                id: "http://x.c",
                type: "number",
                examples: ["1", 2],
            },
            "draft-06",
        );

        const result = validator.validate(1);
        console.log("hyprtjump", JSON.stringify(result));
    });
});
