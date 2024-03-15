import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.exclusiveMaximum module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a number with exclusiveMaximum constraint equal to limit", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    exclusiveMaximum: 3,
                },
                2.9,
                vocabularyActuatorConstant.keys.exclusiveMaximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.exclusiveMaximum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number above the exclusiveMaximum constraint", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    exclusiveMaximum: 3.1,
                },
                3.1,
                vocabularyActuatorConstant.keys.exclusiveMaximum,
                0,
                0,
                [vocabularyActuatorConstant.keys.exclusiveMaximum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.exclusiveMaximum);
        });
    });
});
