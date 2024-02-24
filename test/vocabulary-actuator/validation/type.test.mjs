import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.type module", () => {
    describe("test the resolve(string) function", () => {
        it("should pass when validating a string with type 'string'", () => {
            const context = execResolve(
                {
                    type: "string",
                },
                "test",
                vocabularyActuatorConstant.keys.type,
                0,
                0,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when validating a string with type 'any'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "any",
                },
                "test",
                vocabularyActuatorConstant.keys.type,
                0,
                0,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when validating an integer with type 'integer'", () => {
            const context = execResolve(
                {
                    type: "integer",
                },
                1,
                vocabularyActuatorConstant.keys.type,
                0,
                0,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a decimal number with type 'integer'", () => {
            const context = execResolve(
                {
                    type: "integer",
                },
                1.1,
                vocabularyActuatorConstant.keys.type,
                0,
                0,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });
        it("should fail when validating a decimal number with type 'boolean'", () => {
            const context = execResolve(
                {
                    type: "boolean",
                },
                1.1,
                vocabularyActuatorConstant.keys.type,
                0,
                0,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });
    });
    describe("test the resolve(array) function", () => {
        it("should pass when validating a string or number with type ['string', 'number']", () => {
            const context = execResolve(
                {
                    type: ["string", "number"],
                },
                "test",
                vocabularyActuatorConstant.keys.type,
                0,
                1,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when validating a number with type ['string', 'number']", () => {
            const context = execResolve(
                {
                    type: ["string", "number"],
                },
                1,
                vocabularyActuatorConstant.keys.type,
                0,
                1,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a boolean with type ['string', 'number']", () => {
            const context = execResolve(
                {
                    type: ["string", "number"],
                },
                true,
                vocabularyActuatorConstant.keys.type,
                0,
                1,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });

        it("should pass when validating a number within maximum limit with type ['string', {type: 'number', maximum: 10}]\n", () => {
            const context = execResolve(
                {
                    type: [
                        "string",
                        {
                            type: "number",
                            maximum: 10,
                        },
                    ],
                },
                9,
                vocabularyActuatorConstant.keys.type,
                0,
                1,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a string with invalid length with type [{type: 'string', maxLength: 2}, {type: 'number', maximum: 10}, {type: 'string', minLength: 5}]", () => {
            const context = execResolve(
                {
                    type: [
                        {
                            type: "string",
                            maxLength: 2,
                        },
                        {
                            type: "number",
                            maximum: 10,
                        },
                        {
                            type: "string",
                            minLength: 5,
                        },
                    ],
                },
                "test",
                vocabularyActuatorConstant.keys.type,
                0,
                1,
                [vocabularyActuatorConstant.keys.type],
                undefined,
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });
    });
});
