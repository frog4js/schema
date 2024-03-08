import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { schemaManage } from "../../src/schema/share.mjs";
import { contextManage } from "../../src/context/share.mjs";
import { urlUtil } from "../../src/util/share.mjs";
import { defaultConfigManage } from "../../src/default-config/share.mjs";
import { contextConstant, versionConstant } from "../../src/constants/share.mjs";
import { vocabularyActuatorManage } from "../../src/vocabulary-actuator/share.mjs";

/**
 * @typedef {import("../types/share")}
 */

describe.only("", () => {
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
        });
        const schema = {
            definitions: {
                refToInteger: {
                    $ref: "#foo",
                },
                A: {
                    id: "#foo",
                    type: "integer",
                },
            },
            id: "/locationIndependentIdentifierDraft4.json",
        };
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        const { valid } = vocabularyActuatorManage.validate(context, "f");
        console.log(valid);
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
        });
        const schema = {
            id: "/sss.json",
            definitions: {
                integer: {
                    type: "integer",
                },
                refToInteger: {
                    $ref: "#/definitions/integer",
                },
            },
        };
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        const { valid } = vocabularyActuatorManage.validate(context, "f");
        console.log(valid);
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
        });
        const schema = {
            $ref: "http://json-schema.org/draft-04/schema#",
        };
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        const { valid, errors } = vocabularyActuatorManage.validate(context, {
            definitions: {
                foo: {
                    type: 1,
                    exclusiveMaximum: false,
                    exclusiveMinimum: false,
                    additionalItems: {},
                    items: {},
                    uniqueItems: false,
                    additionalProperties: {},
                    definitions: {},
                    properties: {},
                    patternProperties: {},
                    not: {},
                },
            },
            exclusiveMaximum: false,
            exclusiveMinimum: false,
            additionalItems: {},
            items: {},
            uniqueItems: false,
            additionalProperties: {},
            properties: {},
            patternProperties: {},
            not: {},
        });
        assert.equal(valid, false);
        console.log(valid, errors);
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
        });
        const schema = {
            definitions: {
                int: {
                    type: "integer",
                },
            },
            allOf: [
                {
                    properties: {
                        foo: {
                            $ref: "#/definitions/int",
                        },
                    },
                },
                {
                    additionalProperties: {
                        $ref: "#/definitions/int",
                    },
                },
            ],
        };
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        const { valid, errors } = vocabularyActuatorManage.validate(context, {
            foo: "a string",
        });
        assert.equal(valid, false);
        console.log(valid, errors);
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
        });
        const schema = {
            properties: {
                foo: {
                    not: {},
                },
            },
        };
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        {
            const { valid, errors } = vocabularyActuatorManage.validate(context, {
                bar: 1,
                baz: 2,
            });
            assert.equal(valid, true);
        }
        {
            const { valid, errors } = vocabularyActuatorManage.validate(context, {
                foo: 1,
                baz: 2,
            });
            assert.equal(valid, false);
        }
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
        });
        const schema = {
            type: "object",
            patternProperties: {
                "\\p{Letter}cole": {},
            },
            additionalProperties: false,
        };
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);

        const { valid, errors } = vocabularyActuatorManage.validate(context, {
            "l'ecole": "pas de vraie vie",
        });
        assert.equal(valid, true);
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-04/schema#",
            strict: false,
        });
        const schema = {
            id: "file:///folder/file.json",
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
        };
        const data = {};
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        {
            const { valid, errors } = vocabularyActuatorManage.validate(context, data);
            assert.equal(valid, true);
        }
    });

    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-06/schema#",
            strict: false,
        });
        const schema = true;
        const data = {};
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        {
            const { valid, errors } = vocabularyActuatorManage.validate(context, data);
            assert.equal(valid, true);
        }
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-06/schema#",
            strict: false,
        });
        const schema = false;
        const data = {};
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
        {
            const { valid, errors } = vocabularyActuatorManage.validate(context, data);
            assert.equal(valid, true);
        }
    });
    it("should pass when schema is $ref", () => {
        const context = contextManage.create({
            $schema: "http://json-schema.org/draft-06/schema#",
            strict: false,
        });
        const schema = {
            allOf: [{ $ref: "#/definitions/bool" }],
            definitions: {
                bool: false,
            },
        };
        const data = {};
        schemaManage.setMainSchema(context, schema);
        schemaManage.compile(context);
    });
});
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
                    message: "system error: UserGroup not found or is not a valid schema",
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
