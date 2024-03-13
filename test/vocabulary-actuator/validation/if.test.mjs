import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";
import { contextManage } from "../../../src/context/share.mjs";

describe("test the executes.if module", () => {
    describe("test the resolve(boolean) function", () => {
        it("should pass when if value is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    if: true,
                },
                2.9,
                vocabularyActuatorConstant.keys.if,
                0,
                0,
                [vocabularyActuatorConstant.keys.if],
                undefined,
            );
            assert.equal(contextManage.getCache(context, vocabularyActuatorConstant.keys.if), true);
        });
    });
    describe("test the resolve(object) function", () => {
        it("should pass when if value is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    if: {
                        maximum: 10,
                    },
                },
                2.9,
                vocabularyActuatorConstant.keys.if,
                0,
                1,
                [vocabularyActuatorConstant.keys.if],
                undefined,
            );
            assert.equal(contextManage.getCache(context, vocabularyActuatorConstant.keys.if), true);
        });
        it("should pass when if value is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    if: {
                        maximum: 10,
                    },
                },
                11,
                vocabularyActuatorConstant.keys.if,
                0,
                1,
                [vocabularyActuatorConstant.keys.if],
                undefined,
            );
            assert.equal(contextManage.getCache(context, vocabularyActuatorConstant.keys.if), false);
        });
    });
});
