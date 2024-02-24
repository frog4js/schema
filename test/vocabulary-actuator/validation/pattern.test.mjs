import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
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
                vocabularyActuatorConstant.keys.pattern,
                0,
                0,
                [vocabularyActuatorConstant.keys.pattern],
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
                vocabularyActuatorConstant.keys.pattern,
                0,
                0,
                [vocabularyActuatorConstant.keys.pattern],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.pattern);
        });
    });
});
