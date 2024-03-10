import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.items module", () => {
    describe("test the resolve(object) function", () => {
        it("should pass when validating object properties with string values", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                        },
                    },
                },
                [{ name: "test" }, { name: "test1" }],
                vocabularyActuatorConstant.keys.items,
                0,
                0,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating object properties with incorrect value types", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: { type: "number" },
                        },
                    },
                },
                [{ name: "test" }, { name: "test1" }],
                vocabularyActuatorConstant.keys.items,
                0,
                0,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 2);
        });
    });
    describe("test the resolve(array) function", () => {
        it("should pass when validating array items with correct value types", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "number" }, { type: "string" }],
                },
                [{ name: 1 }, { name: "test1" }],
                vocabularyActuatorConstant.keys.items,
                0,
                0,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when validating array items with incorrect value types", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [{ type: "number" }, { type: "string" }],
                },
                [{ name: "test" }, { name: 1 }],
                vocabularyActuatorConstant.keys.items,
                0,
                1,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 2);
        });
    });
    describe("test the resolve(boolean) function", () => {
        it("should pass when schema items is false and instance value is empty array", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: false,
                },
                [],
                vocabularyActuatorConstant.keys.items,
                1,
                0,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
        it("should fail when schema items is false and instance value is any non-empty array", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: false,
                },
                [1, "foo", true],
                vocabularyActuatorConstant.keys.items,
                1,
                0,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 3);
        });
        it("should pass when schema items is [true, false] and instance value is [1]", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: [true, false],
                },
                [1],
                vocabularyActuatorConstant.keys.items,
                1,
                0,
                [vocabularyActuatorConstant.keys.items],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
