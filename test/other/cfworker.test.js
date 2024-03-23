import { describe, it, beforeEach } from "node:test";
import { Validator } from "@cfworker/json-schema";

describe("test the hyprtjump json schema", () => {
    it(async () => {
        const schema = {
            id: "1222",
            definitions: {
                a: {
                    id: "xxxx",
                },
            },
        };
        const data = {};

        const validator = new Validator(schema, "draft-04");
        const result = validator.validate(data);
        console.log("hyprtjump", JSON.stringify(result));
    }, "test1");
});
