import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.minItems module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an array with length equal to minItems constraint", () => {
            const context = execResolve(
                {
                    type: "array",
                    minItems: 3,
                },
                [1, 2, 3],
                vocabularyActuatorConstant.keys.minItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.minItems],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating an array with length above the minItems constraint", () => {
            const context = execResolve(
                {
                    type: "array",
                    minItems: 3,
                },
                [1, 2],
                vocabularyActuatorConstant.keys.minItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.minItems],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "minItemsMustBeLessThanOrEqualToLimit");
        });
    });
});
