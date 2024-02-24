import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";
describe("test the executes.dependencies module", () => {
    describe("test the resolve(string) function", () => {
        it("should fail when 'age' dependency is missing for 'name' property", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "object",
                    dependencies: {
                        name: "age",
                        age: ["email", "gender"],
                        area: {
                            properties: {
                                area: {
                                    type: "string",
                                    pattern: "[a-z]{1},[a-z]{1},[a-z]{1}",
                                },
                            },
                        },
                    },
                },
                {
                    name: "1111",
                },
                vocabularyActuatorConstant.keys.dependencies,
                0,
                0,
                [vocabularyActuatorConstant.keys.dependencies],
                undefined,
                undefined,
                vocabularyActuatorConstant.ticks.nextExecute,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.dependencies);
        });
        it("should fail when 'email' and 'gender' dependencies are missing for 'age' property", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "object",
                    dependencies: {
                        name: "age",
                        age: ["email", "gender"],
                        area: {
                            properties: {
                                area: {
                                    type: "string",
                                    pattern: "[a-z]{1},[a-z]{1},[a-z]{1}",
                                },
                            },
                        },
                    },
                },
                {
                    name: "1111",
                    age: 1,
                },
                vocabularyActuatorConstant.keys.dependencies,
                0,
                0,
                [vocabularyActuatorConstant.keys.dependencies],
                undefined,
                undefined,
                vocabularyActuatorConstant.ticks.nextExecute,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.dependencies);
        });

        it("should fail when 'area' property does not match the specified pattern", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "object",
                    dependencies: {
                        name: "age",
                        age: ["email", "gender"],
                        area: {
                            properties: {
                                area: {
                                    type: "string",
                                    pattern: "[a-z]{1},[a-z]{1},[a-z]{1}",
                                },
                            },
                        },
                    },
                },
                {
                    name: "1111",
                    age: 1,
                    email: "xxx@xx.com",
                    gender: "mam",
                    area: "111",
                },
                vocabularyActuatorConstant.keys.dependencies,
                0,
                0,
                [vocabularyActuatorConstant.keys.dependencies],
                undefined,
                undefined,
                vocabularyActuatorConstant.ticks.nextExecute,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.dependencies);
        });

        it("should pass when all dependencies are met and 'area' property matches the pattern", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "object",
                    dependencies: {
                        name: "age",
                        age: ["email", "gender"],
                        area: {
                            properties: {
                                area: {
                                    type: "string",
                                    pattern: "[a-z]{1},[a-z]{1},[a-z]{1}",
                                },
                            },
                        },
                    },
                },
                {
                    name: "1111",
                    age: 1,
                    email: "xxx@xx.com",
                    gender: "mam",
                    area: "a,b,c",
                },
                vocabularyActuatorConstant.keys.dependencies,
                0,
                0,
                [vocabularyActuatorConstant.keys.dependencies],
                undefined,
                undefined,
                vocabularyActuatorConstant.ticks.nextExecute,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
