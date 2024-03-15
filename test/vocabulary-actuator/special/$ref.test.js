import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { contextManage } from "../../../src/context/share.js";
import { schemaManage } from "../../../src/schema/share.js";

describe("test the $ref module", () => {
    it("should validate and store references correctly", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            type: "object",
            properties: {
                name: {
                    $ref: "#/definitions/ref1",
                },
                age: {
                    $ref: "#/definitions/ref2",
                },
            },
        });
        assert.equal(context.waitValidateRefs.length, 2);
    });
});
