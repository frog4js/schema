import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { contextManage } from "../../src/context/share.js";
import { vocabularyActuatorConstant, versionConstant } from "../../src/constants/share.js";
import { schemaManage } from "../../src/schema/share.js";
import {
    getParentInstance,
    getParentSchema,
    getSiblingInstanceRefData,
    getSiblingSchemaRefData,
} from "../../src/context/manage.js";

/**
 * @typedef {import("../types/share")}
 */
describe("test the context manage module", () => {
    let schema = {
        type: "object",
        properties: {
            array: { type: "array", items: { $ref: "#/arrayItem" } },
        },
        arrayItem: {
            type: "object",
            properties: {
                name: { type: "string" },
                age: { type: "number" },
            },
        },
    };

    describe("test the create function", () => {
        it("should return the correct context object when default config is empty", () => {
            const context = contextManage.create();
            assert.deepStrictEqual(context.errors, []);
            assert.deepStrictEqual(context.instancePaths, []);
            assert.deepStrictEqual(context.schemaPaths, []);
            assert.deepStrictEqual(context.schemaData, {});
            assert.deepStrictEqual(context.instanceData, {});
            assert.deepStrictEqual(context.version, versionConstant.jsonSchemaVersionGroups.lastVersions[0]);
        });
        it("should fail when default config type is invalid", () => {
            assert.throws(
                () => {
                    contextManage.create(1);
                },
                {
                    name: "DefaultConfigError",
                    message: "default config is invalid",
                },
            );
        });
    });
    describe("test the enterContext function", () => {
        /**
         *
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, {
                type: "object",
                properties: {
                    name: { type: "string" },
                },
            });
            schemaManage.compile(context);
            context.instanceData = {
                origin: {
                    name: "str",
                },
            };
            context.instancePaths = [];
        });
        it("should add instance key to instancePaths and update instanceData", () => {
            const instanceKey = "name";
            contextManage.enterContext(context, undefined, instanceKey);
            assert.deepStrictEqual(context.instancePaths, [instanceKey]);
            assert.deepStrictEqual(context.schemaPaths, [
                vocabularyActuatorConstant.pathKeys.ref,
                vocabularyActuatorConstant.pathKeys.self,
            ]);
            assert.equal(context.instanceData.current.$ref, context.instanceData.origin);
            assert.equal(context.schemaData.current.key, vocabularyActuatorConstant.pathKeys.self);
        });

        it("should add schema key to schemaPaths and update schemaData", () => {
            const schemaKey = "properties";

            contextManage.enterContext(context, schemaKey);

            assert.deepStrictEqual(context.schemaPaths, [
                vocabularyActuatorConstant.pathKeys.ref,
                vocabularyActuatorConstant.pathKeys.self,
                schemaKey,
            ]);
            assert.deepStrictEqual(context.instancePaths, []);
            assert.equal(context.schemaData.current.$ref, context.schemaData.origin);
            assert.equal(context.instanceData.current.key, "root");
        });

        it("should add schema key and schema key", () => {
            const schemaKey = "properties";
            const instanceKey = "name";

            contextManage.enterContext(context, schemaKey, instanceKey);

            assert.deepStrictEqual(context.schemaPaths, [
                vocabularyActuatorConstant.pathKeys.ref,
                vocabularyActuatorConstant.pathKeys.self,
                schemaKey,
            ]);
            assert.deepStrictEqual(context.instancePaths, [instanceKey]);
            assert.equal(context.schemaData.current.$ref, context.schemaData.origin);
            assert.equal(context.instanceData.current.$ref, context.instanceData.origin);
        });

        it("should not update instancePaths or instanceData if both instanceKey and schemaKey are undefined", () => {
            contextManage.enterContext(context);
            assert.deepStrictEqual(context.schemaPaths, [
                vocabularyActuatorConstant.pathKeys.ref,
                vocabularyActuatorConstant.pathKeys.self,
            ]);
            assert.deepStrictEqual(context.instancePaths, []);
            assert.equal(context.schemaData.current.key, vocabularyActuatorConstant.pathKeys.self);
            assert.equal(context.instanceData.current.key, "root");
        });
    });
    describe("test the backContext function", () => {
        /**
         *
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, {
                type: "object",
                properties: {
                    name: { type: "string" },
                },
            });
            schemaManage.compile(context);
            context.instanceData = {
                origin: {
                    name: "str",
                },
            };
            context.instancePaths = [];
        });
        it("should remove last element from instancePaths and schemaPaths", () => {
            contextManage.enterContext(context, "properties", "name");
            contextManage.backContext(context, "properties", "name");
            assert.deepStrictEqual(context.instancePaths, []);
            assert.deepStrictEqual(context.schemaPaths, [
                vocabularyActuatorConstant.pathKeys.ref,
                vocabularyActuatorConstant.pathKeys.self,
            ]);
        });
        it("should remove last element from instancePaths", () => {
            contextManage.enterContext(context, "properties", "name");
            contextManage.backContext(context, undefined, "name");
            assert.deepStrictEqual(context.instancePaths, []);
            assert.deepStrictEqual(context.schemaPaths, [
                vocabularyActuatorConstant.pathKeys.ref,
                vocabularyActuatorConstant.pathKeys.self,
                "properties",
            ]);
        });
    });

    describe("test the getParentInstance function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = { array: [{ name: true, age: 1 }] };
        });
        it("should return the parent instance", () => {
            contextManage.enterContext(context, undefined, "array");
            contextManage.enterContext(context, undefined, 0);
            contextManage.enterContext(context, undefined, "name");

            const result = getParentInstance(context);

            assert.deepEqual(result, context.instanceData.origin.array[0]);
        });
    });

    describe("test the getParentSchema function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = { array: [{ name: true, age: 1 }] };
        });
        it("should return the parent schema", () => {
            contextManage.enterContext(context, "properties");
            contextManage.enterContext(context, "array");
            contextManage.enterContext(context, "items");
            contextManage.enterContext(context, vocabularyActuatorConstant.pathKeys.ref);
            contextManage.enterContext(context, vocabularyActuatorConstant.pathKeys.self);
            contextManage.enterContext(context, "arrayItem");
            contextManage.enterContext(context, "properties");
            contextManage.enterContext(context, "name");
            contextManage.enterContext(context, "type");
            const result = getParentSchema(context);

            assert.deepEqual(result, context.schemaData.origin.arrayItem.properties.name);
        });
    });
    describe("test the getSiblingSchemaRefData function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = { array: [{ name: true, age: 1 }] };
        });
        it("should return correct sibling schema ref data for schema paths is empty array", () => {
            let data = getSiblingSchemaRefData(context, "test");
            assert.deepEqual(data.$ref, context.referenceSchemas);
        });

        it("should correctly update context and return sibling schema ref data for 'type' key", () => {
            contextManage.enterContext(context, "properties");
            let data = getSiblingSchemaRefData(context, "type");
            assert.deepEqual(data.key, "type");
            assert.deepEqual(data.$ref[data.key], "object");
        });
    });
    describe("test the getSiblingInstanceRefData function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = { array: [{ name: true, age: 1 }] };
        });
        it("should return correct sibling instance ref data for instance paths is empty array", () => {
            let data = getSiblingInstanceRefData(context, "test");
            assert.deepEqual(data.key, "root");
        });

        it("should correctly update context and return instance schema ref data for 'name' key", () => {
            contextManage.enterContext(context, undefined, "array");
            contextManage.enterContext(context, undefined, 0);
            contextManage.enterContext(context, undefined, "name");
            let data = getSiblingInstanceRefData(context, "name");
            assert.equal(data.key, "name");
            assert.equal(data.$ref[data.key], true);
        });
    });
    describe("test the lock function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = contextManage.create();
            schemaManage.setMainSchema(context, {
                anyOf: [
                    { type: "string" },
                    {
                        anyOf: [
                            {
                                type: "object",
                                additionalProperties: { type: "string" },
                            },
                            {
                                type: "object",
                                additionalProperties: { type: "number" },
                            },
                        ],
                    },
                    {
                        type: "number",
                    },
                    {
                        type: "boolean",
                    },
                ],
            });
            schemaManage.compile(context);
            context.instanceData.origin = { name: 1 };
        });

        it("should lock when no previous locks exist", () => {
            contextManage.enterContext(context, "anyOf");
            contextManage.enterContext(context, 0);
            const result = contextManage.lock(context);
            assert.strictEqual(result, true);
            assert.deepStrictEqual(context.locks, [
                {
                    paths: [
                        vocabularyActuatorConstant.pathKeys.ref,
                        vocabularyActuatorConstant.pathKeys.self,
                        "anyOf",
                        0,
                    ],
                    errors: [],
                },
            ]);
        });

        it("should lock when current paths are same as last lock", () => {
            contextManage.enterContext(context, "anyOf");
            contextManage.enterContext(context, 1);
            let result = contextManage.lock(context);
            assert.strictEqual(result, true);
            result = contextManage.lock(context);
            assert.strictEqual(result, true);
            assert.deepStrictEqual(context.locks, [
                {
                    paths: [
                        vocabularyActuatorConstant.pathKeys.ref,
                        vocabularyActuatorConstant.pathKeys.self,
                        "anyOf",
                        1,
                    ],
                    errors: [],
                },
            ]);
        });

        it("should lock when current paths are superset of last lock", () => {
            contextManage.enterContext(context, "anyOf");
            contextManage.enterContext(context, 1);
            let result = contextManage.lock(context);
            assert.strictEqual(result, true);
            contextManage.enterContext(context, "anyOf");
            contextManage.enterContext(context, 0);
            result = contextManage.lock(context);
            assert.strictEqual(result, true);
            assert.deepStrictEqual(context.locks, [
                {
                    paths: [
                        vocabularyActuatorConstant.pathKeys.ref,
                        vocabularyActuatorConstant.pathKeys.self,
                        "anyOf",
                        1,
                    ],
                    errors: [],
                },
                {
                    paths: [
                        vocabularyActuatorConstant.pathKeys.ref,
                        vocabularyActuatorConstant.pathKeys.self,
                        "anyOf",
                        1,
                        "anyOf",
                        0,
                    ],
                    errors: [],
                },
            ]);
        });

        it("should not lock when current paths are different from last lock", () => {
            contextManage.enterContext(context, "anyOf");
            contextManage.enterContext(context, 1);
            contextManage.enterContext(context, "anyOf");
            contextManage.enterContext(context, 0);
            let result = contextManage.lock(context);
            assert.strictEqual(result, true);
            contextManage.backContext(context, 0);
            contextManage.backContext(context, "anyOf");
            result = contextManage.lock(context);
            assert.strictEqual(result, false);
        });
    });
});
