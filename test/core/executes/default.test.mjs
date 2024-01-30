import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.default module", () => {
    describe("test the resolve(match reference | undefined ) function", () => {
        it("default value passes validation when the instance is undefined", () => {
            const context = execResolve(
                {
                    type: "object",
                    default: {
                        name: "test",
                    },
                },
                undefined,
                executeConstant.keys.default,
                0,
                0,
                [executeConstant.keys.default],
                undefined,
                {
                    phase: "schemaValidate",
                },
            );
            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.name, "test");
        });

        it("default value failed validation when the instance is undefined", () => {
            const context = execResolve(
                {
                    type: "object",
                    default: true,
                },
                undefined,
                executeConstant.keys.default,
                0,
                0,
                [executeConstant.keys.default],
                undefined,
                {
                    phase: "schemaValidate",
                },
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "defaultMustComplyWithSchema");
        });

        it("default value passes validation when the instance property is undefined", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        child: { type: "object", default: { name: "test1" } },
                    },
                    default: {
                        child: {
                            name: "test",
                        },
                    },
                },
                { other: true },
                executeConstant.keys.default,
                0,
                0,
                [executeConstant.keys.properties, "child", executeConstant.keys.default],
                ["child"],
                {
                    phase: "schemaValidate",
                },
            );

            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.child.name, "test1");
            assert.equal(context.instanceData.origin.other, true);
        });

        it("default value passes validation when the instance is undefined and default value is array", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: { name: { type: "string" } },
                    },
                    default: [{ name: "test" }, { name: "test1" }],
                },
                undefined,
                executeConstant.keys.default,
                0,
                0,
                [executeConstant.keys.default],
                undefined,
                {
                    phase: "schemaValidate",
                },
            );
            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.length, 2);
        });

        it("default value failed validation when the instance is undefined and default value is array", () => {
            const context = execResolve(
                {
                    type: "array",
                    items: {
                        type: "object",
                        properties: { name: { type: "string" } },
                    },
                    default: [{ name: 1 }, { name: 2 }],
                },
                undefined,
                executeConstant.keys.default,
                0,
                0,
                [executeConstant.keys.default],
                undefined,
                {
                    phase: "schemaValidate",
                },
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "defaultMustComplyWithSchema");
        });
    });

    describe("test the resolve(match primitive | undefined ) function", () => {
        it("default value passes validation when the instance is undefined", () => {
            const context = execResolve(
                {
                    type: "number",
                    default: 1,
                },
                undefined,
                executeConstant.keys.default,
                0,
                1,
                [executeConstant.keys.default],
                undefined,
                {
                    phase: "schemaValidate",
                },
            );
            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin, 1);
        });

        it("default value passes validation when the instance property is undefined", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string", default: "test" },
                    },
                },
                {},
                executeConstant.keys.default,
                0,
                1,
                [executeConstant.keys.properties, "name", executeConstant.keys.default],
                ["name"],
                {
                    phase: "schemaValidate",
                },
            );
            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.name, "test");
        });
    });
});
