import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.oneOf module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "string",
            oneOf: [{ maximum: 3 }, { type: "integer" }],
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance is 1.5", () => {
            const context = execResolve(
                schema,
                1.5,
                vocabularyActuatorConstant.keys.oneOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.oneOf],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass validation when instance is 2.5", () => {
            const context = execResolve(
                schema,
                2.5,
                vocabularyActuatorConstant.keys.oneOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.oneOf],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance is 2", () => {
            const context = execResolve(
                schema,
                2,
                vocabularyActuatorConstant.keys.oneOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.oneOf],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.oneOf);
        });

        it("should fail validation when instance is 5.5", () => {
            const context = execResolve(
                schema,
                5.5,
                vocabularyActuatorConstant.keys.oneOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.oneOf],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.oneOf);
        });
    });
});
