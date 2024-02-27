import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe.only("test the executes.exclusiveMinimum module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a number with exclusiveMinimum constraint equal to limit", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-06/schema#",
                    type: "number",
                    exclusiveMinimum: 3,
                },
                3.1,
                vocabularyActuatorConstant.keys.exclusiveMinimum,
                0,
                0,
                [vocabularyActuatorConstant.keys.exclusiveMinimum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number below the exclusiveMinimum constraint", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "number",
                    exclusiveMinimum: 3.1,
                },
                3.1,
                vocabularyActuatorConstant.keys.exclusiveMinimum,
                0,
                0,
                [vocabularyActuatorConstant.keys.exclusiveMinimum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.exclusiveMinimum);
        });
    });
});
