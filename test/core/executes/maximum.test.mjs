import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.maximum module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a number with maximum constraint equal to limit", () => {
            const context = execResolve(
                {
                    type: "number",
                    maximum: 3,
                },
                3,
                executeConstant.keys.maximum,
                0,
                0,
                [executeConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number above the maximum constraint", () => {
            const context = execResolve(
                {
                    type: "number",
                    maximum: 3.1,
                },
                3.12,
                executeConstant.keys.maximum,
                0,
                0,
                [executeConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "maximumMustBeLessThanOrEqualToLimit");
        });

        it("should pass when validating an integer with maximum constraint and maximumCanEqual option set to true", () => {
            const context = execResolve(
                {
                    type: "integer",
                    maximum: 3,
                    maximumCanEqual: true,
                },
                3,
                executeConstant.keys.maximum,
                0,
                0,
                [executeConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number with maximum constraint and maximumCanEqual option set to false", () => {
            const context = execResolve(
                {
                    type: "number",
                    maximum: 3,
                    maximumCanEqual: false,
                },
                3,
                executeConstant.keys.maximum,
                0,
                0,
                [executeConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "maximumMustBeLessThanLimit");
        });
    });
});
