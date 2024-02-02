import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.minimum module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a number with minimum constraint equal to limit", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    minimum: 3,
                },
                3,
                executeConstant.keys.minimum,
                0,
                0,
                [executeConstant.keys.minimum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number below the minimum constraint", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    minimum: 3.1,
                },
                3.09,
                executeConstant.keys.minimum,
                0,
                0,
                [executeConstant.keys.minimum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "minimumMustBeLessThanOrEqualToLimit");
        });

        it("should pass when validating an integer with minimum constraint and minimumCanEqual option set to true", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "integer",
                    minimum: 3,
                    minimumCanEqual: true,
                },
                3,
                executeConstant.keys.minimum,
                0,
                0,
                [executeConstant.keys.minimum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number with minimum constraint and minimumCanEqual option set to false", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    minimum: 3,
                    minimumCanEqual: false,
                },
                3,
                executeConstant.keys.minimum,
                0,
                0,
                [executeConstant.keys.minimum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "minimumMustBeLessThanLimit");
        });
        it("should pass when validating an integer with minimum constraint and exclusiveMinimum option set to false", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "integer",
                    minimum: 3,
                    exclusiveMinimum: false,
                },
                3,
                executeConstant.keys.minimum,
                0,
                0,
                [executeConstant.keys.minimum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number with minimum constraint and exclusiveMinimum option set to true", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "number",
                    minimum: 3,
                    exclusiveMinimum: true,
                },
                3,
                executeConstant.keys.minimum,
                0,
                0,
                [executeConstant.keys.minimum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "minimumMustBeLessThanLimit");
        });
    });
});
