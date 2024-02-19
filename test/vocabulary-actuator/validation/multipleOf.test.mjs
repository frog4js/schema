import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.multipleOf module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "integer",
            multipleOf: 2,
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance is 2", () => {
            const context = execResolve(
                schema,
                2,
                vocabularyActuatorConstant.keys.multipleOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.multipleOf],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance is 3", () => {
            const context = execResolve(
                schema,
                3,
                vocabularyActuatorConstant.keys.multipleOf,
                0,
                0,
                [vocabularyActuatorConstant.keys.multipleOf],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "multipleOfMustBeDivisible");
        });
    });
});
