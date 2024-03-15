import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { schemaManage } from "../../src/schema/share.js";
import { contextManage } from "../../src/context/share.js";
import { urlUtil } from "../../src/util/share.js";
import { defaultConfigManage } from "../../src/default-config/share.js";
import { contextConstant, versionConstant } from "../../src/constants/share.js";
import { vocabularyActuatorManage } from "../../src/vocabulary-actuator/share.js";

/**
 * @typedef {import("../types/share")}
 */

describe("test the schema manage module", () => {
    describe("test the addReferenceSchema function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
        });
        it("should fail when $schema not is exists", () => {
            assert.throws(
                () => {
                    const context1 = contextManage.create();
                    context1.defaultConfig = {
                        $schema: "http://xxxxx",
                    };
                    schemaManage.addReferenceSchema(context1, {});
                },
                {
                    name: "SystemError",
                },
            );
        });

        it("should fail when type not is in enum", () => {
            try {
                schemaManage.addReferenceSchema(context, {
                    type: "2222334",
                });
                assert.fail();
            } catch (e) {
                assert.equal(e.name, "SchemaInvalidError");
                assert.equal(e.errors.length, 1);
            }
        });
        it("should pass when schema is valid", () => {
            const schema = {
                $schema: "http://json-schema.org/draft-04/schema#",
                id: "User",
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                },
            };
            schemaManage.addReferenceSchema(context, schema);

            assert.equal(
                Object.keys(context.referenceSchemas).includes(
                    urlUtil.calculateId(schema.id, defaultConfigManage.getSystemDefaultConfig().baseURI),
                ),
                true,
            );
            assert.equal(
                context.referenceSchemas["#"]?.id,
                versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersions.draft04],
            );
            assert.equal(context.schemaData.main, undefined);
        });
    });
    describe("test the setMainSchema function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
        });
        it("should pass when schema is valid", () => {
            const schema = {
                $schema: "http://json-schema.org/draft-03/schema#",
                id: "User",
                type: "object",
                properties: {
                    name: {
                        type: "string",
                    },
                },
            };
            schemaManage.setMainSchema(context, schema);
            assert.equal(
                Object.keys(context.referenceSchemas).includes(
                    urlUtil.calculateId(schema.id, defaultConfigManage.getSystemDefaultConfig().baseURI),
                ),
                true,
            );
            assert.equal(
                context.referenceSchemas["#"]?.id,
                versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersions.draft03],
            );
            assert.ok(context.schemaData.main);
        });

        it("should pass when schema is true", () => {
            const schema = true;
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
        });
        it("should pass when schema is false", () => {
            const schema = false;
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
        });
    });

    describe("test the compile function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
        });
        it("should fail when state does not equal init", () => {
            schemaManage.setMainSchema(context, {});
            schemaManage.compile(context);
            assert.throws(
                () => {
                    schemaManage.compile(context);
                },
                {
                    name: "SystemError",
                    message: "system error: state does not equal init. current state is " + context.state,
                },
            );
        });
        it("should fail when main schema not set", () => {
            assert.throws(
                () => {
                    schemaManage.compile(context);
                },
                {
                    name: "SystemError",
                    message: "system error: main schema not set",
                },
            );
        });

        it("should fail when main schema not set", () => {
            schemaManage.setMainSchema(context, {
                properties: {
                    group: {
                        $ref: "UserGroup",
                    },
                },
            });

            assert.throws(
                () => {
                    schemaManage.compile(context);
                },
                {
                    name: "SystemError",
                    message: "system error: https://github.com/frog4js/UserGroup not found or is not a valid schema",
                },
            );
        });
        it("should pass when schema is valid", () => {
            schemaManage.addReferenceSchema(context, {
                $schema: "http://json-schema.org/draft-03/schema#",
                id: "UserGroup",
                type: "object",
                properties: {
                    count: {
                        type: "number",
                        divisibleBy: 3,
                    },
                },
            });
            schemaManage.setMainSchema(context, {
                $schema: "http://json-schema.org/draft-06/schema#",
                $id: "User",
                properties: {
                    group: {
                        $ref: "UserGroup",
                    },
                    ext: {
                        $ref: "http://github.com/ext#",
                    },
                    age: {
                        type: "number",
                        exclusiveMinimum: 1,
                    },
                },
            });
            schemaManage.addReferenceSchema(context, {
                $schema: "http://json-schema.org/draft-04/schema#",
                id: "http://github.com/ext#",
                type: "object",
                properties: {
                    isSupper: {
                        type: "boolean",
                    },
                    count: {
                        type: "number",
                        minimum: 1,
                        exclusiveMinimum: false,
                    },
                },
            });
            schemaManage.compile(context);
            assert.equal(Object.keys(context.referenceSchemas).length, 8);
            assert.equal(
                context.referenceSchemas["#"].$id,
                urlUtil.calculateId("User", defaultConfigManage.getSystemDefaultConfig().baseURI),
            );
            assert.equal(context.state, contextConstant.states.compile);
            assert.ok(context.schemaData.main);
        });
        it("should pass when id is uuid", () => {
            schemaManage.setMainSchema(context, {
                $comment: "URIs do not have to have HTTP(s) schemes",
                $id: "urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed",
                properties: {
                    foo: { $ref: "#/definitions/bar" },
                },
                definitions: {
                    bar: { type: "string" },
                },
            });
            schemaManage.compile(context);
            assert.equal(Object.keys(context.referenceSchemas).length, 4);
            assert.equal(context.referenceSchemas["#"].$id, "urn:uuid:deadbeef-1234-00ff-ff00-4321feebdaed");
            assert.equal(context.state, contextConstant.states.compile);
            assert.ok(context.schemaData.main);
        });
        it("should pass when id is file", () => {
            schemaManage.setMainSchema(context, {
                $id: "file:///folder/file.json",
                definitions: {
                    foo: {
                        type: "number",
                    },
                },
                allOf: [
                    {
                        $ref: "#/definitions/foo",
                    },
                ],
            });
            schemaManage.compile(context);
            assert.equal(Object.keys(context.referenceSchemas).length, 4);
            assert.equal(context.referenceSchemas["#"].$id, "file:///folder/file.json");
            assert.equal(context.state, contextConstant.states.compile);
            assert.ok(context.schemaData.main);
        });
        it("should pass when have $id and ref", () => {
            schemaManage.setMainSchema(context, {
                $id: "http://localhost:1234/sibling_id/base/",
                definitions: {
                    foo: {
                        $id: "http://localhost:1234/sibling_id/foo.json",
                        type: "string",
                    },
                    base_foo: {
                        $comment: "this canonical uri is http://localhost:1234/sibling_id/base/foo.json",
                        $id: "foo.json",
                        type: "number",
                    },
                },
                allOf: [
                    {
                        $comment:
                            "$ref resolves to http://localhost:1234/sibling_id/base/foo.json, not http://localhost:1234/sibling_id/foo.json",
                        $id: "http://localhost:1234/sibling_id/",
                        $ref: "foo.json",
                    },
                ],
            });
            schemaManage.compile(context);
        });
    });
    describe("test the switchVersion function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
        });
        it("should pass when switch draft-04 version", () => {
            schemaManage.switchVersion(context, "http://json-schema.org/draft-03/schema#");
            assert.equal(context.version, versionConstant.jsonSchemaVersions.draft03);
        });
        it("should fail when switch draft-not-fount version", () => {
            schemaManage.switchVersion(context, "http://json-schema.org/draft-not-fount/schema#");
            assert.equal(context.version, versionConstant.jsonSchemaVersions.draft07);
        });
    });
    describe("test the getLast$schemaDraft function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
        });
        it("should pass by get last draft", () => {
            assert.ok(schemaManage.getLast$schemaDraft());
        });
    });
    describe("test the getAll$schemaDrafts function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
        });
        it("should pass by get all draft", () => {
            assert.ok(schemaManage.getAll$schemaDrafts());
        });
    });
});
