import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe.only("test the hyprtjump json schema", () => {
    it("test1", async () => {
        const validator = new Validator(
            {
                properties: {
                    name: {
                        writeOnly: true,
                    },
                },
            },
            "draft-07",
        );
        const data = { name: "1" };
        const result = validator.validate(data);
        console.log(data.name);
        console.log("hyprtjump", JSON.stringify(result));
    });
});
