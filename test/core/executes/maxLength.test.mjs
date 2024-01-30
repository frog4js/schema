import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.maxLength module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a string with length equal to maxLength constraint", () => {
            const context = execResolve(
                {
                    type: "string",
                    maxLength: 3,
                },
                "123",
                executeConstant.keys.maxLength,
                0,
                0,
                [executeConstant.keys.maxLength],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a string with length above the maxLength constraint", () => {
            const context = execResolve(
                {
                    type: "string",
                    maxLength: 3,
                },
                "1234",
                executeConstant.keys.maxLength,
                0,
                0,
                [executeConstant.keys.maxLength],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "maxLengthMustBeGreaterThanOrEqualToLimit");
        });
    });
});
