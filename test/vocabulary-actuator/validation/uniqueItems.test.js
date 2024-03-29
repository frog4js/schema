import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.uniqueItems module", () => {
    describe("test the resolve function", () => {
        it("should pass validation when array has unique items", () => {
            const context = execResolve(
                {
                    type: "array",
                    uniqueItems: true,
                },
                [0, 1],
                vocabularyActuatorConstant.keys.uniqueItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.uniqueItems],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation with divisibleByMustNotHaveDuplicateItems error when array has duplicate items", () => {
            const context = execResolve(
                {
                    type: "array",
                    uniqueItems: true,
                },
                [0, 1, 2, 4, 0],
                vocabularyActuatorConstant.keys.uniqueItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.uniqueItems],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.uniqueItems);
        });

        it("should pass validation when uniqueItems is false", () => {
            const context = execResolve(
                {
                    type: "array",
                    uniqueItems: false,
                },
                [0, 1, 2, 4, 0],
                vocabularyActuatorConstant.keys.uniqueItems,
                0,
                0,
                [vocabularyActuatorConstant.keys.uniqueItems],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
