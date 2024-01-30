import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

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
                executeConstant.keys.properties,
                0,
                0,
                [executeConstant.keys.properties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when validating an object without specified properties", () => {
            const context = execResolve(
                {
                    type: "object",
                },
                {
                    name: "test",
                    age: 1,
                },
                executeConstant.keys.properties,
                0,
                0,
                [executeConstant.keys.properties],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
