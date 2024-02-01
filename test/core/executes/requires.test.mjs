import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";
describe("test the executes.requires module", () => {
    describe("test the resolve(string) function", () => {
        it("should pass when validating an object with missing required property", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        age: { type: "number", requires: "name" },
                    },
                },
                {
                    age: "error",
                },
                executeConstant.keys.requires,
                0,
                0,
                [executeConstant.keys.properties, "age", executeConstant.keys.requires],
                ["age"],
                undefined,
                executeConstant.ticks.endExecute,
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass when validating an object with correct required property", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        age: { type: "number", requires: "name" },
                    },
                },
                {
                    name: "test",
                    age: "error",
                },
                executeConstant.keys.requires,
                0,
                0,
                [executeConstant.keys.properties, "age", executeConstant.keys.requires],
                ["age"],
                executeConstant.ticks.nextExecute,
            );
            assert.equal(context.errors.length, 0);
        });
    });

    describe("test the resolve(object) function", () => {
        it("should pass when validating an object with invalid required property", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        age: { type: "string", maxLength: 1, requires: { maxLength: 2 } },
                    },
                },
                {
                    age: "test",
                },
                executeConstant.keys.requires,
                0,
                1,
                [executeConstant.keys.properties, "age", executeConstant.keys.requires],
                ["age"],
                [],
                undefined,
                executeConstant.ticks.endExecute,
            );
            assert.equal(context.errors.length, 0);
        });
        it("should pass when validating an object with correct required property", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                        age: { type: "string", maxLength: 1, requires: { maxLength: 6 } },
                    },
                },
                {
                    age: "error",
                },
                executeConstant.keys.requires,
                0,
                1,
                [executeConstant.keys.properties, "age", executeConstant.keys.requires],
                ["age"],
                executeConstant.ticks.nextExecute,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
