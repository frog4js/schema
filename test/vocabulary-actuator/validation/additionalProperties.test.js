import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.additionalProperties module", () => {
    describe("test the resolve(match boolean) function", () => {
        it("should pass when additional properties are allowed", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                    additionalProperties: true,
                },
                {
                    name: "str",
                    age: 1,
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should fail when additional properties are not allowed", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                    additionalProperties: false,
                },
                {
                    name: "str",
                    age: 1,
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.additionalProperties);
        });

        it("should pass when no additional properties are provided", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                    additionalProperties: false,
                },
                {
                    name: "str",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should fail when additional properties are not allowed and provided", () => {
            const context = execResolve(
                {
                    type: "object",
                    additionalProperties: false,
                },
                {
                    name: "str",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 1);
        });

        it("should pass when no additional properties are provided", () => {
            const context = execResolve(
                {
                    type: "object",
                    additionalProperties: false,
                },
                {},
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                0,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 0);
        });
    });
    describe("test the resolve(match object) function", () => {
        it("should pass when additional properties match the schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                    additionalProperties: {
                        type: "string",
                    },
                },
                {
                    name: "str",
                    age: "10",
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                1,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should fail when additional properties do not match the schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                    additionalProperties: {
                        type: "string",
                    },
                },
                {
                    name: "str",
                    age: 1,
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                1,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });

        it("should fail when additional properties do not match the schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                    },
                },
                {
                    name: "str",
                    age: 1,
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                1,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });

        it("should pass when additional properties match the schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    additionalProperties: {
                        type: "string",
                    },
                },
                {
                    name: "str",
                    age: "1",
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                1,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 0);
        });

        it("should fail when additional properties do not match the schema", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "object",
                    additionalProperties: {
                        $ref: "#/addition",
                    },
                    addition: {
                        type: "string",
                    },
                },
                {
                    name: "str",
                    age: 1,
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                1,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.type);
        });

        it("should pass when additional properties match the schema", () => {
            const context = execResolve(
                {
                    type: "object",
                    additionalProperties: {
                        $ref: "#/addition",
                    },
                    addition: {
                        type: "string",
                    },
                },
                {
                    name: "str",
                    age: "1",
                    sex: "man",
                },
                vocabularyActuatorConstant.keys.additionalProperties,
                0,
                1,
                [vocabularyActuatorConstant.keys.additionalProperties],
            );

            assert.equal(context.errors.length, 0);
        });
    });
});
