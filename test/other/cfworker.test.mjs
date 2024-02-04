import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe.skip("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                $schema: "https://json-schema.org/draft/draft-04/schema",
                type: "object",
                dependencies: {
                    name: {
                        type: "object",
                    },
                },
                id: "test1",
            },
            "draft-04",
        );

        const result = validator.validate({ name: 1 });
        console.log("hyprtjump", JSON.stringify(result));
    });
});
