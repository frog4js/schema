import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { contextManage } from "../../../src/context/share.js";
import { schemaManage } from "../../../src/schema/share.js";
describe("test the examples module", () => {
    it("should fail when examples not meeting the constraints of the schema", () => {
        const context = contextManage.create();
        try {
            schemaManage.setMainSchema(context, {
                type: "object",
                examples: [{}, {}, "111"],
            });
            assert.fail();
        } catch (e) {
            assert.equal(e.name, "SchemaInvalidError");
            assert.equal(e.errors.length, 1);
        }
    });

    it("should pass when examples meeting the constraints of the schema", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    examples: ["test"],
                },
            },
            examples: [{ name: "a" }, { name: "b" }],
        });
    });
});
