import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.uniqueItems module", () => {
    describe("test the resolve function", () => {
        it("should pass validation when array has unique items", () => {
            const context = execResolve(
                {
                    type: "array",
                    uniqueItems: true,
                },
                [0, 1],
                executeConstant.keys.uniqueItems,
                0,
                0,
                [executeConstant.keys.uniqueItems],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation with divisibleByMustNotHaveDuplicateItems error when array has duplicate items", () => {
            const context = execResolve(
                {
                    type: "array",
                    uniqueItems: true,
                },
                [0, 1, 2, 4, 0],
                executeConstant.keys.uniqueItems,
                0,
                0,
                [executeConstant.keys.uniqueItems],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "divisibleByMustNotHaveDuplicateItems");
        });

        it("should pass validation when uniqueItems is false", () => {
            const context = execResolve(
                {
                    type: "array",
                    uniqueItems: false,
                },
                [0, 1, 2, 4, 0],
                executeConstant.keys.uniqueItems,
                0,
                0,
                [executeConstant.keys.uniqueItems],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
