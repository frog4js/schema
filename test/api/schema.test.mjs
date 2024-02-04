import { describe, it, beforeEach } from "node:test";
import { schemaManage } from "../../src/api/share.mjs";
import * as assert from "assert";
import { typeConstant } from "../../src/constants/share.mjs";

describe("test the schema module", () => {
    describe("test the create function", () => {
        it("should throw a TypeError when the input is undefined", () => {
            assert.throws(
                () => {
                    schemaManage.create(undefined);
                },
                {
                    name: "Error",
                    message: "schema is invalid: must be a JSON object",
                },
            );
        });
        it("should throw a TypeError when the input is not an object", () => {
            assert.throws(
                () => {
                    schemaManage.create(1);
                },
                {
                    name: "Error",
                    message: "schema is invalid: must be a JSON object",
                },
            );
        });
        it("should throw a TypeError when the input is an array", () => {
            assert.throws(
                () => {
                    schemaManage.create([]);
                },
                {
                    name: "Error",
                    message: "schema is invalid: must be a JSON object",
                },
            );
        });

        it("should create an empty schema with default values when $schema is draft-01", () => {
            const schema = schemaManage.create({
                $schema: "http://json-schema.org/draft-01/schema#",
            });
            assert.ok(schema);
            assert.ok(schema.$schema);
            assert.equal(schema.$id, undefined);
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
                maximumCanEqual: true,
                minimumCanEqual: true,
            });
        });
        it("should set the $schema property of the schema", () => {
            const schema = schemaManage.create({});
            assert.equal(schema.$schema, "http://json-schema.org/draft-03/schema#");
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

            assert.throws(
                () => {
                    schemaManage.create({ "#name": { type: { $ref: "#" } } });
                },
                {
                    name: "Error",
                },
            );
        });

        it("should create a schema with not found types", () => {
            const schema = schemaManage.create({ type: ["string", "number", "notFound"] });
            assert.ok(schema);
        });

        it("should create a schema with duplicate types", () => {
            const schema = schemaManage.create({
                $schema: "http://json-schema.org/draft-01/schema#",
                type: ["string", "string"],
            });
            assert.ok(schema);
        });

        it("should throw an error when invalid types are provided", () => {
            assert.throws(
                () => {
                    schemaManage.create({ type: ["string", 1, true, BigInt("21")] });
                },
                {
                    name: "Error",
                },
            );
        });

        it("should create a schema with nested types and $ref", () => {
            const schema = schemaManage.create({
                type: [
                    "string",
                    {},
                    { $ref: "#a" },
                    {
                        type: "object",
                    },
                    {
                        $ref: "#",
                    },
                ],
                "#a": {},
            });
            assert.ok(schema);
        });
    });
});
