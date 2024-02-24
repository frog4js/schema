import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { contextConstant, vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
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
                vocabularyActuatorConstant.keys.default,
                0,
                1,
                [vocabularyActuatorConstant.keys.default],
                undefined,
                {
                    phase: contextConstant.phases.schemaValidate,
                },
            );
            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.name, "test");
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
                vocabularyActuatorConstant.keys.default,
                0,
                1,
                [vocabularyActuatorConstant.keys.properties, "child", vocabularyActuatorConstant.keys.default],
                ["child"],
                {
                    phase: contextConstant.phases.instanceValidate,
                },
            );

            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.child.name, "test1");
            assert.equal(context.instanceData.origin.other, true);
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
                vocabularyActuatorConstant.keys.default,
                0,
                2,
                [vocabularyActuatorConstant.keys.default],
                undefined,
                {
                    phase: contextConstant.phases.schemaValidate,
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
                vocabularyActuatorConstant.keys.default,
                0,
                2,
                [vocabularyActuatorConstant.keys.properties, "name", vocabularyActuatorConstant.keys.default],
                ["name"],
                {
                    phase: contextConstant.phases.schemaValidate,
                },
            );
            assert.equal(context.errors.length, 0);
            assert.equal(context.instanceData.origin.name, "test");
        });
    });
});
