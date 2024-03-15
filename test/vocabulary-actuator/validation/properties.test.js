import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.properties module", () => {
    describe("test the resolve function", () => {
        it("should pass when validating an object with correct properties", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                        },
                        age: {
                            type: "number",
                        },
                    },
                },
                {
                    name: "test",
                    age: 1,
                },
                vocabularyActuatorConstant.keys.properties,
                0,
                0,
                [vocabularyActuatorConstant.keys.properties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when validating an object without specified properties", () => {
            const context = execResolve(
                {
                    type: "object",
                    properties: {},
                },
                {
                    name: "test",
                    age: 1,
                },
                vocabularyActuatorConstant.keys.properties,
                0,
                0,
                [vocabularyActuatorConstant.keys.properties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
