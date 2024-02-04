import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.required module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an required string which is undefined", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    required: false,
                },
                undefined,
                executeConstant.keys.required,
                0,
                0,
                [executeConstant.keys.required],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a required string which is undefined", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "string",
                    required: true,
                },
                undefined,
                executeConstant.keys.required,
                0,
                0,
                [executeConstant.keys.required],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "requiredMustBeExists");
        });
    });
});
