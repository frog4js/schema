import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { vocabularyActuatorConstant } from "../../../src/constants/share.js";
import { execResolve } from "./helper.js";

describe("test the executes.propertyNames module", () => {
    let schema;
    beforeEach(() => {
        schema = {
            $schema: "http://json-schema.org/draft-06/schema#",
            type: "object",
            propertyNames: {
                format: "email",
            },
        };
    });
    describe("test the resolve function", () => {
        it("should pass validation when instance property name is email", () => {
            const context = execResolve(
                schema,
                { "xxx@x1.com": "any", "xxx@x2.com": "any" },
                vocabularyActuatorConstant.keys.propertyNames,
                0,
                0,
                [vocabularyActuatorConstant.keys.propertyNames],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when instance property name not is email", () => {
            const context = execResolve(
                schema,
                { "xxx1.com": "any", "xxx2.com": "any" },
                vocabularyActuatorConstant.keys.propertyNames,
                0,
                0,
                [vocabularyActuatorConstant.keys.propertyNames],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.propertyNames);
        });

        it("should pass validation when schema is true", () => {
            const context = execResolve(
                { propertyNames: true },
                {},
                vocabularyActuatorConstant.keys.propertyNames,
                0,
                1,
                [vocabularyActuatorConstant.keys.propertyNames],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass validation when schema is false", () => {
            const context = execResolve(
                { propertyNames: false },
                {},
                vocabularyActuatorConstant.keys.propertyNames,
                0,
                1,
                [vocabularyActuatorConstant.keys.propertyNames],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });
    });
});
