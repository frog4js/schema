import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.contains module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-06/schema#",
            type: "array",
            contains: {
                type: "number",
            },
        };
    });
    describe("test the resolve(object) function", () => {
        it("should pass validation when instance contains number item", () => {
            const context = execResolve(
                schema,
                ["str", 1, "str2"],
                vocabularyActuatorConstant.keys.contains,
                0,
                0,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance is empty array", () => {
            const context = execResolve(
                schema,
                [],
                vocabularyActuatorConstant.keys.contains,
                0,
                0,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.contains);
        });
        it("should fail validation when instance not contains number item", () => {
            const context = execResolve(
                schema,
                ["1", "2"],
                vocabularyActuatorConstant.keys.contains,
                0,
                0,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.contains);
        });
    });
    describe("test the resolve(boolean) function", () => {
        it("should pass validation when schema is true and any non-empty array is valid", () => {
            const context = execResolve(
                { contains: true },
                ["foo"],
                vocabularyActuatorConstant.keys.contains,
                0,
                1,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when schema is true and empty array is invalid", () => {
            const context = execResolve(
                { contains: true },
                [],
                vocabularyActuatorConstant.keys.contains,
                0,
                1,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.contains);
        });
        it("should fail validation when schema is false and any non-empty array is valid", () => {
            const context = execResolve(
                { contains: false },
                ["foo"],
                vocabularyActuatorConstant.keys.contains,
                0,
                1,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.contains);
        });

        it("should fail validation when schema is false and empty array is invalid", () => {
            const context = execResolve(
                { contains: false },
                [],
                vocabularyActuatorConstant.keys.contains,
                0,
                1,
                [vocabularyActuatorConstant.keys.contains],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.contains);
        });
    });
});
