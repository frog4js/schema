import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe.only("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                type: "object",
                then: { required: ["bar"] },
                else: { required: ["baz"] },
            },
            "draft-07",
        );

        const result = validator.validate({});
        console.log("hyprtjump", JSON.stringify(result));
    });
});
