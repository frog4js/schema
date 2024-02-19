import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.divisibleBy module", () => {
    describe("test the resolve function", () => {
        it("should pass validation when number is divisible by 0", () => {
            const context = execResolve(
                {
                    type: "number",
                    divisibleBy: 0,
                },
                1.2,
                vocabularyActuatorConstant.keys.divisibleBy,
                0,
                0,
                [vocabularyActuatorConstant.keys.divisibleBy],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass validation when negative number is divisible by negative divisibleBy value", () => {
            const context = execResolve(
                {
                    type: "number",
                    divisibleBy: -0.2,
                },
                -0.4,
                vocabularyActuatorConstant.keys.divisibleBy,
                0,
                0,
                [vocabularyActuatorConstant.keys.divisibleBy],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation with divisibleByMustBeDivisible error when number is not divisible by divisibleBy value", () => {
            const context = execResolve(
                {
                    type: "number",
                    divisibleBy: 3,
                },
                10,
                vocabularyActuatorConstant.keys.divisibleBy,
                0,
                0,
                [vocabularyActuatorConstant.keys.divisibleBy],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "divisibleByMustBeDivisible");
        });
    });
});
