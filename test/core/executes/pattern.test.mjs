import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.pattern module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a string that matches the pattern", () => {
            const context = execResolve(
                {
                    type: "string",
                    pattern: "^abc",
                },
                "abc",
                executeConstant.keys.pattern,
                0,
                0,
                [executeConstant.keys.pattern],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a string that does not match the pattern", () => {
            const context = execResolve(
                {
                    type: "string",
                    pattern: "^abc",
                },
                "1abc",
                executeConstant.keys.pattern,
                0,
                0,
                [executeConstant.keys.pattern],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "patternMustMatchPattern");
        });
    });
});
