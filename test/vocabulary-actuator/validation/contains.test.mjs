import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

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
    describe("test the resolve function", () => {
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
});
