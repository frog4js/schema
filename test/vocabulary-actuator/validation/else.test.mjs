import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";
import { contextManage } from "../../../src/context/share.mjs";

describe("test the executes.else module", () => {
    describe("test the resolve(boolean) function", () => {
        it("should pass when else value is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: true,
                },
                2.9,
                vocabularyActuatorConstant.keys.else,
                0,
                0,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: false },
                    },
                ],
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when else value is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: false,
                },
                2.9,
                vocabularyActuatorConstant.keys.else,
                0,
                0,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: false },
                    },
                ],
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.else);
        });
        it("should pass when else value is false and if value is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: false,
                },
                2.9,
                vocabularyActuatorConstant.keys.else,
                0,
                0,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: true },
                    },
                ],
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass when else value is false and if value is undefined", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: false,
                },
                2.9,
                vocabularyActuatorConstant.keys.else,
                0,
                0,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: undefined },
                    },
                ],
            );
            assert.equal(context.errors.length, 0);
        });
    });
    describe("test the resolve(object) function", () => {
        it("should pass when else valid is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: {
                        maximum: 10,
                    },
                },
                2.9,
                vocabularyActuatorConstant.keys.else,
                0,
                1,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: false },
                    },
                ],
            );
            assert.equal(context.errors.length, 0);
        });
        it("should fail when else valid is false", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: {
                        maximum: 10,
                    },
                },
                12.9,
                vocabularyActuatorConstant.keys.else,
                0,
                1,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: false },
                    },
                ],
            );
            assert.equal(context.errors.length, 2);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.maximum);
            assert.equal(context.errors[1].currentSchemaKey, vocabularyActuatorConstant.keys.else);
        });
        it("should pass when else valid is false and if value is true", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: {
                        maximum: 10,
                    },
                },
                12.9,
                vocabularyActuatorConstant.keys.else,
                0,
                1,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: true },
                    },
                ],
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass when else valid is false and if value is undefined", () => {
            const context = execResolve(
                {
                    type: "number",
                    else: {
                        maximum: 10,
                    },
                },
                12.9,
                vocabularyActuatorConstant.keys.else,
                0,
                1,
                [vocabularyActuatorConstant.keys.else],
                undefined,
                undefined,
                undefined,
                [
                    {
                        schemaPaths: [
                            vocabularyActuatorConstant.pathKeys.ref,
                            vocabularyActuatorConstant.pathKeys.self,
                        ],
                        instancePaths: [],
                        data: { if: undefined },
                    },
                ],
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
