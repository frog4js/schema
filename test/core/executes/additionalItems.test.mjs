import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.additionalItems module", () => {
    describe("test the resolve(match boolean) function", () => {
        it("should pass when additional items are allowed", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "string" }],
                    additionalItems: true,
                },
                ["test", true],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should fail when additional items are not allowed", () => {
            const context = execResolve(
                {
                    type: "object",
                    items: [{ type: "string" }],
                    additionalItems: false,
                },
                ["test", true],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "additionalItemsMustNotHaveMoreItems");
        });

        it("should pass when no additional items are provided", () => {
            const context = execResolve(
                {
                    type: "object",
                    items: [{ type: "string" }],
                    additionalItems: false,
                },
                ["test"],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should pass when additional items are not allowed and provided", () => {
            const context = execResolve(
                {
                    type: "array",
                    additionalItems: false,
                },
                ["test"],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should pass when no additional items are provided", () => {
            const context = execResolve(
                {
                    type: "object",
                    additionalItems: false,
                },
                [],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should pass validation when additional items in object type do not have additionalItems schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    items: { type: "string" },
                    additionalItems: false,
                },
                ["test", "test1"],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });
    });
    describe("test the resolve(match object) function", () => {
        it("should pass when additional items match the schema", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "string" }],
                    additionalItems: {
                        type: "number",
                    },
                },
                ["test", 1],
                executeConstant.keys.additionalItems,
                0,
                1,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should fail when additional items do not match the schema", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "string" }],
                    additionalItems: {
                        type: "number",
                    },
                },
                ["test", "error"],
                executeConstant.keys.additionalItems,
                0,
                1,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "typeMustBeOfTheType");
        });

        it("should pass validation when no additional items are present", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "string" }],
                    additionalItems: {
                        type: "number",
                    },
                },
                ["test"],
                executeConstant.keys.additionalItems,
                0,
                1,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should pass validation when additional items in object type do not have additionalItems schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    items: { type: "string" },
                    additionalItems: {
                        type: "number",
                    },
                },
                ["test", "test1"],
                executeConstant.keys.additionalItems,
                0,
                0,
                [executeConstant.keys.additionalItems],
            );

            assert.equal(context.errors.length, 0);
        });
    });
});
