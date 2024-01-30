import { describe, it, beforeEach } from "node:test";
import { schemaManage } from "../../src/api/share.mjs";
import * as assert from "assert";

describe("test the api module", () => {
    describe("test the create function", () => {
        it("should throw a TypeError when the input is undefined", () => {
            assert.throws(
                () => {
                    schemaManage.create(undefined);
                },
                {
                    name: "TypeError",
                    message: "Input value must be an object type, received undefined",
                },
            );
        });
        it("should throw a TypeError when the input is not an object", () => {
            assert.throws(
                () => {
                    schemaManage.create(1);
                },
                {
                    name: "TypeError",
                    message: "Input value must be an object type, received number",
                },
            );
        });
        it("should throw a TypeError when the input is an array", () => {
            assert.throws(
                () => {
                    schemaManage.create([]);
                },
                {
                    name: "TypeError",
                    message: "Input value must be an object type, received array",
                },
            );
        });

        it("should create an empty schema with default values", () => {
            const schema = schemaManage.create({});
            assert.ok(schema);
            assert.ok(schema.$schema);
            assert.ok(schema.$id);
            delete schema.$schema;
            delete schema.$id;
            assert.deepEqual(schema, {
                type: "any",
                properties: {},
                items: {},
                optional: false,
                additionalProperties: {},
                minItems: 0,
                minLength: 0,
                extends: {},
            });
        });
        it("should set the $schema property of the schema", () => {
            const schema = schemaManage.create({ $schema: "http://json-schema.org/draft-01/schema#" });
            assert.equal(schema.$schema, "http://json-schema.org/draft-01/schema#");
        });

        it("should set the $id property of the schema", () => {
            const schema = schemaManage.create({ $id: "test1" });
            assert.equal(schema.$id, "test1");
        });

        it("should throw an Error when the type property is invalid", () => {
            assert.throws(
                () => {
                    schemaManage.create({ type: true });
                },
                {
                    name: "Error",
                },
            );
        });

        it("should set child schema with a valid type", () => {
            const schema = schemaManage.create({ "#name": { type: "string" } });
            assert.equal(schema["#name"].type, "string");
        });

        it("should set child schema with a invalid type", () => {
            assert.throws(
                () => {
                    schemaManage.create({ "#name": { type: true } });
                },
                {
                    name: "Error",
                },
            );
        });
    });
});
