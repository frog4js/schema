import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.optional module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an optional string which is undefined", () => {
            const context = execResolve(
                {
                    type: "string",
                    optional: true,
                },
                undefined,
                executeConstant.keys.optional,
                0,
                0,
                [executeConstant.keys.optional],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a required string which is undefined", () => {
            const context = execResolve(
                {
                    type: "string",
                    optional: false,
                },
                undefined,
                executeConstant.keys.optional,
                0,
                0,
                [executeConstant.keys.optional],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "optionalMustBeExists");
        });
    });
});
