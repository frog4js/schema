import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.maxDecimal module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating a number with maxDecimal constraint", () => {
            const context = execResolve(
                {
                    type: "number",
                    maxDecimal: 2,
                },
                1.2,
                vocabularyActuatorConstant.keys.maxDecimal,
                0,
                0,
                [vocabularyActuatorConstant.keys.maxDecimal],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating a number exceeding the maxDecimal constraint", () => {
            const context = execResolve(
                {
                    type: "number",
                    maxDecimal: 2,
                },
                1.222,
                vocabularyActuatorConstant.keys.maxDecimal,
                0,
                0,
                [vocabularyActuatorConstant.keys.maxDecimal],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "maxDecimalMustBeLessThanOrEqualToLimit");
        });
    });
});
