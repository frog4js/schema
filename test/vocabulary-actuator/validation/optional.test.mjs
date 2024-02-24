import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.optional module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an optional string which is undefined", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "string",
                    optional: true,
                },
                undefined,
                vocabularyActuatorConstant.keys.optional,
                0,
                0,
                [vocabularyActuatorConstant.keys.optional],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a required string which is undefined", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-01/schema#",
                    type: "string",
                    optional: false,
                },
                undefined,
                vocabularyActuatorConstant.keys.optional,
                0,
                0,
                [vocabularyActuatorConstant.keys.optional],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.optional);
        });
    });
});
