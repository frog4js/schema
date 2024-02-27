import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.maximum module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a number with maximum constraint equal to limit", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    maximum: 3,
                },
                3,
                vocabularyActuatorConstant.keys.maximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number above the maximum constraint", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    maximum: 3.1,
                },
                3.12,
                vocabularyActuatorConstant.keys.maximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maximum);
        });

        it("should pass when validating an integer with maximum constraint and maximumCanEqual option set to true", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "integer",
                    maximum: 3,
                    maximumCanEqual: true,
                },
                3,
                vocabularyActuatorConstant.keys.maximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number with maximum constraint and maximumCanEqual option set to false", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    maximum: 3,
                    maximumCanEqual: false,
                },
                3,
                vocabularyActuatorConstant.keys.maximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maximum);
        });

        it("should pass when validating an integer with maximum constraint and exclusiveMaximum option set to false", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "integer",
                    maximum: 3,
                    exclusiveMaximum: false,
                },
                3,
                vocabularyActuatorConstant.keys.maximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number with maximum constraint and maximumCanEqual option set to true", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "number",
                    maximum: 3,
                    exclusiveMaximum: true,
                },
                3,
                vocabularyActuatorConstant.keys.maximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maximum);
        });
    });
    describe("test the resolve(draft-06) function", () => {
        it("should pass when validating a number with maximum constraint equal to limit", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    maximum: 3,
                },
                3,
                vocabularyActuatorConstant.keys.maximum,
                1,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number above the maximum constraint", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    maximum: 3.1,
                },
                3.11,
                vocabularyActuatorConstant.keys.maximum,
                1,
                0,
                [vocabularyActuatorConstant.keys.maximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maximum);
        });
    });
});
