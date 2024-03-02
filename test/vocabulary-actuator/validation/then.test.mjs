import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";
import { contextManage } from "../../../src/context/share.mjs";

describe("test the executes.then module", () => {
    describe("test the resolve(boolean) function", () => {
        it("should pass when then value is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: true,
                },
                2.9,
                vocabularyActuatorConstant.keys.then,
                0,
                0,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: true } }],
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when then value is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: false,
                },
                2.9,
                vocabularyActuatorConstant.keys.then,
                0,
                0,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: true } }],
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.then);
        });
        it("should pass when then value is false and if value is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: false,
                },
                2.9,
                vocabularyActuatorConstant.keys.then,
                0,
                0,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: false } }],
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass when then value is false and if value is undefined", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: false,
                },
                2.9,
                vocabularyActuatorConstant.keys.then,
                0,
                0,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: undefined } }],
            );
            assert.equal(context.errors.length, 0);
        });
    });
    describe("test the resolve(object) function", () => {
        it("should pass when then valid is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: {
                        maximum: 10,
                    },
                },
                2.9,
                vocabularyActuatorConstant.keys.then,
                0,
                1,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: true } }],
            );
            assert.equal(context.errors.length, 0);
        });
        it("should fail when then valid is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: {
                        maximum: 10,
                    },
                },
                12.9,
                vocabularyActuatorConstant.keys.then,
                0,
                1,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: true } }],
            );
            assert.equal(context.errors.length, 2);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maximum);
            assert.equal(context.errors[1].currentSchemaKey, vocabularyActuatorConstant.keys.then);
        });
        it("should pass when then valid is false and if value is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: {
                        maximum: 10,
                    },
                },
                12.9,
                vocabularyActuatorConstant.keys.then,
                0,
                1,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: false } }],
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass when then valid is false and if value is undefined", () => {
            const context = execResolve(
                {
                    type: "number",
                    then: {
                        maximum: 10,
                    },
                },
                12.9,
                vocabularyActuatorConstant.keys.then,
                0,
                1,
                [vocabularyActuatorConstant.keys.then],
                undefined,
                undefined,
                undefined,
                [{ paths: [], data: { if: undefined } }],
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
