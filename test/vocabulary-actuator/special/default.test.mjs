import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { contextManage } from "../../../src/context/share.mjs";
import { schemaManage } from "../../../src/schema/share.mjs";
describe("test the default module", () => {
    it("default value failed validation when the default type is boolean", () => {
        const context = contextManage.create();
        try {
            schemaManage.setMainSchema(context, {
                type: "object",
                default: true,
            });
            assert.fail();
        } catch (e) {
            assert.equal(e.name, "SchemaInvalidError");
            assert.equal(e.errors.length, 1);
        }
    });

    it("default value pass validation when the default type is object", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            type: "object",
            default: {},
        });
        assert.ok(true);
    });

    it("should set main schema with valid default values", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            type: "object",
            $id: "User",
            additionalProperties: false,
            definitions: {
                a: {
                    type: "string",
                },
            },
            properties: {
                name: {
                    type: "number",
                    default: 22,
                },
                age: {
                    type: "object",
                    properties: {
                        a: {
                            $ref: "#/definitions/a",
                        },
                    },
                    default: {
                        a: "222",
                    },
                },
            },
        });
        assert.ok(true);
    });
    it("should throw SchemaInvalidError when setting main schema with invalid default values", () => {
        const context = contextManage.create();
        try {
            schemaManage.setMainSchema(context, {
                type: "object",
                $id: "User",
                additionalProperties: false,
                definitions: {
                    a: {
                        type: "string",
                    },
                },
                properties: {
                    name: {
                        type: "number",
                        default: "22",
                    },
                    age: {
                        type: "object",
                        properties: {
                            a: {
                                $ref: "#/definitions/a",
                            },
                        },
                        default: {
                            a: 222,
                        },
                    },
                },
            });
            assert.fail();
        } catch (e) {
            assert.equal(e.name, "SchemaInvalidError");
            assert.equal(e.errors.length, 2);
        }
    });

    it("default value failed validation when the instance is undefined and default value is array", () => {
        const context = contextManage.create();
        try {
            schemaManage.setMainSchema(context, {
                type: "array",
                items: {
                    type: "object",
                    properties: { name: { type: "string" } },
                },
                default: [{ name: 1 }, { name: 2 }],
            });
            assert.fail();
        } catch (e) {
            assert.equal(e.name, "SchemaInvalidError");
            assert.equal(e.errors.length, 1);
        }
    });
    it("default value passes validation when the instance is undefined and default value is array", () => {
        const context = contextManage.create();

        schemaManage.setMainSchema(context, {
            type: "array",
            items: {
                type: "object",
                properties: { name: { type: "string" } },
            },
            default: [{ name: "test" }, { name: "test1" }],
        });
        assert.ok(true);
    });
});
