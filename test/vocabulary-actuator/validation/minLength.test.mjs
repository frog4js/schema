import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.minLength module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a string with length equal to minLength constraint", () => {
            const context = execResolve(
                {
                    type: "string",
                    minLength: 3,
                },
                "123",
                vocabularyActuatorConstant.keys.minLength,
                0,
                0,
                [vocabularyActuatorConstant.keys.minLength],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a string with length above the minLength constraint", () => {
            const context = execResolve(
                {
                    type: "string",
                    minLength: 3,
                },
                "12",
                vocabularyActuatorConstant.keys.minLength,
                0,
                0,
                [vocabularyActuatorConstant.keys.minLength],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.minLength);
        });
    });
});
