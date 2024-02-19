import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.anyOf module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "string",
            anyOf: [{ maximum: 3 }, { type: "integer" }],
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance is 1.5", () => {
            const context = execResolve(
                schema,
                1.5,
                vocabularyActuatorConstant.keys.anyOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.anyOf],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass validation when instance is 2", () => {
            const context = execResolve(
                schema,
                2,
                vocabularyActuatorConstant.keys.anyOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.anyOf],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance is 4.5", () => {
            const context = execResolve(
                schema,
                4.5,
                vocabularyActuatorConstant.keys.anyOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.anyOf],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "anyOfMustMatchASchemaInAnyOf");
        });

        it("should fail validation when instance is 5.5", () => {
            const context = execResolve(
                schema,
                5.5,
                vocabularyActuatorConstant.keys.anyOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.anyOf],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "anyOfMustMatchASchemaInAnyOf");
        });
    });
});
