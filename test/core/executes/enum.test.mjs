import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.enum module", () => {
    describe("test the resolve function", () => {
        it("should pass when enum value is included in enum array", () => {
            const context = execResolve(
                {
                    type: "string",
                    enum: ["test", "test1"],
                },
                "test",
                executeConstant.keys.enum,
                0,
                0,
                [executeConstant.keys.enum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when enum value is not included in enum array", () => {
            const context = execResolve(
                {
                    type: "string",
                    enum: ["test", "test1"],
                },
                "test2",
                executeConstant.keys.enum,
                0,
                0,
                [executeConstant.keys.enum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "enumMustBeEqualToOneOfTheEnumValues");
        });

        it("should pass when property enum value is included in enum array", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string", enum: ["test", "test1"] },
                    },
                },
                { name: "test" },
                executeConstant.keys.enum,
                0,
                0,
                [executeConstant.keys.properties, "name", executeConstant.keys.enum],
                ["name"],
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when property enum value is not included in enum array", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string", enum: ["test", "test1"] },
                    },
                },
                { name: "test2" },
                executeConstant.keys.enum,
                0,
                0,
                [executeConstant.keys.properties, "name", executeConstant.keys.enum],
                ["name"],
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "enumMustBeEqualToOneOfTheEnumValues");
        });
    });
});
