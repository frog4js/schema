import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.items module", () => {
    describe("test the resolve(object) function", () => {
        it("should pass when validating object properties with string values", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                        },
                    },
                },
                [{ name: "test" }, { name: "test1" }],
                executeConstant.keys.items,
                0,
                0,
                [executeConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating object properties with incorrect value types", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "number" },
                        },
                    },
                },
                [{ name: "test" }, { name: "test1" }],
                executeConstant.keys.items,
                0,
                0,
                [executeConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 2);
        });
    });
    describe("test the resolve(array) function", () => {
        it("should pass when validating array items with correct value types", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "number" }, { type: "string" }],
                },
                [{ name: 1 }, { name: "test1" }],
                executeConstant.keys.items,
                0,
                0,
                [executeConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating array items with incorrect value types", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "number" }, { type: "string" }],
                },
                [{ name: "test" }, { name: 1 }],
                executeConstant.keys.items,
                0,
                1,
                [executeConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 2);
        });
    });
});
