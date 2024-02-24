import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.minProperties module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "object",
            minProperties: 2,
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance keys length is 2", () => {
            const context = execResolve(
                schema,
                { a: 1, b: 2 },
                vocabularyActuatorConstant.keys.minProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.minProperties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when  instance keys length is 1", () => {
            const context = execResolve(
                schema,
                { a: 1 },
                vocabularyActuatorConstant.keys.minProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.minProperties],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.minProperties);
        });
    });
});
