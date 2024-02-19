import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.disallow module", () => {
    describe("test the resolve(string) function", () => {
        it("should pass when disallow not equal instance type", () => {
            const context = execResolve(
                {
                    type: ["string", "null", "boolean", { type: "object", properties: { name: "string" } }],
                    disallow: "object",
                },
                "test",
                vocabularyActuatorConstant.keys.disallow,
                0,
                0,
                [vocabularyActuatorConstant.keys.disallow],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when disallow  equal instance type", () => {
            const context = execResolve(
                {
                    type: ["string", "null", "boolean", { type: "object", properties: { name: "string" } }],
                    disallow: "object",
                },
                { name: "test" },
                vocabularyActuatorConstant.keys.disallow,
                0,
                0,
                [vocabularyActuatorConstant.keys.disallow],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "disallowMustNotBeDisallowType");
        });
    });

    describe("test the resolve(array) function", () => {
        it("should pass when disallow not equal instance type", () => {
            const context = execResolve(
                {
                    type: ["string", "null", "boolean", { type: "object", properties: { name: "string" } }],
                    disallow: ["object", "string"],
                },
                true,
                vocabularyActuatorConstant.keys.disallow,
                0,
                1,
                [vocabularyActuatorConstant.keys.disallow],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when disallow  equal instance type", () => {
            const context = execResolve(
                {
                    type: ["string", "null", "boolean", { type: "object", properties: { name: "string" } }],
                    disallow: ["object", "string"],
                },
                "test",
                vocabularyActuatorConstant.keys.disallow,
                0,
                1,
                [vocabularyActuatorConstant.keys.disallow],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "disallowMustNotBeDisallowType");
        });
    });
});
