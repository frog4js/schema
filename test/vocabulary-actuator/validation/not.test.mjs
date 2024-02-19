import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.not module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "number",
            not: { minimum: 3 },
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance is 1", () => {
            const context = execResolve(
                schema,
                1,
                vocabularyActuatorConstant.keys.not,
                0,
                0,
                [vocabularyActuatorConstant.keys.not],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance is 3", () => {
            const context = execResolve(
                schema,
                3,
                vocabularyActuatorConstant.keys.not,
                0,
                0,
                [vocabularyActuatorConstant.keys.not],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "notMustNotBeValid");
        });
    });
});
