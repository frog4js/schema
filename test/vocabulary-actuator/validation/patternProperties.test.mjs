import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.patternProperties module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an object with correct patternProperties", () => {
            const context = execResolve(
                {
                    type: "object",
                    patternProperties: {
                        name: {
                            type: "string",
                        },
                        age: {
                            type: "number",
                        },
                    },
                },
                {
                    name: "test",
                    age: 1,
                },
                vocabularyActuatorConstant.keys.patternProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.patternProperties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when validating an object without specified patternProperties", () => {
            const context = execResolve(
                {
                    type: "object",
                    patternProperties: {},
                },
                {
                    name: "test",
                    age: 1,
                },
                vocabularyActuatorConstant.keys.patternProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.patternProperties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation with typeMustBeOfTheType error when property values do not match the patternProperties schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    patternProperties: {
                        "name|age": {
                            type: "string",
                        },
                        "[": {
                            type: "number",
                        },
                    },
                },
                {
                    name: "test",
                    age: 1,
                    "[": "1",
                },
                vocabularyActuatorConstant.keys.patternProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.patternProperties],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });
    });
});
