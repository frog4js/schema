import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.maxItems module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an array with length equal to maxItems constraint", () => {
            const context = execResolve(
                {
                    type: "array",
                    maxItems: 3,
                },
                [1, 2, 3],
                vocabularyActuatorConstant.keys.maxItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.maxItems],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating an array with length above the maxItems constraint", () => {
            const context = execResolve(
                {
                    type: "array",
                    maxItems: 3,
                },
                [1, 2, 3, 4],
                vocabularyActuatorConstant.keys.maxItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.maxItems],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maxItems);
        });
    });
});
