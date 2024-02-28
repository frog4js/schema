import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.const module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-06/schema#",
            type: "object",
            const: {
                format: "email",
            },
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance  is object", () => {
            const context = execResolve(
                schema,
                { format: "email" },
                vocabularyActuatorConstant.keys.const,
                0,
                0,
                [vocabularyActuatorConstant.keys.const],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance is object", () => {
            const context = execResolve(
                schema,
                { format: "email", type: "string" },
                vocabularyActuatorConstant.keys.const,
                0,
                0,
                [vocabularyActuatorConstant.keys.const],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.const);
        });

        it("should fail validation when instance is number", () => {
            const context = execResolve(
                schema,
                1,
                vocabularyActuatorConstant.keys.const,
                0,
                0,
                [vocabularyActuatorConstant.keys.const],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.const);
        });
    });
});
