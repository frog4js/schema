import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.enum module", () => {
    describe("test the resolve function", () => {
        it("should pass when enum value is included in enum array", () => {
            const context = execResolve(
                {
                    type: "string",
                    enum: ["test", "test1"],
                },
                "test",
                vocabularyActuatorConstant.keys.enum,
                0,
                0,
                [vocabularyActuatorConstant.keys.enum],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when enum value is not included in enum array", () => {
            const context = execResolve(
                {
                    type: "string",
                    enum: ["test", "test1"],
                },
                "test2",
                vocabularyActuatorConstant.keys.enum,
                0,
                0,
                [vocabularyActuatorConstant.keys.enum],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.enum);
        });

        it("should pass when property enum value is included in enum array", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string", enum: ["test", "test1"] },
                    },
                },
                { name: "test" },
                vocabularyActuatorConstant.keys.enum,
                0,
                0,
                [vocabularyActuatorConstant.keys.properties, "name", vocabularyActuatorConstant.keys.enum],
                ["name"],
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when property enum value is not included in enum array", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string", enum: ["test", "test1"] },
                    },
                },
                { name: "test2" },
                vocabularyActuatorConstant.keys.enum,
                0,
                0,
                [vocabularyActuatorConstant.keys.properties, "name", vocabularyActuatorConstant.keys.enum],
                ["name"],
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.enum);
        });
    });
});
