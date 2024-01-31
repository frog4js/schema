import { describe, it, beforeEach } from "node:test";
import {
    createContext,
    enterContext,
    backContext,
    startExecute,
    startRefOrSchemaExecute,
} from "../../src/core/engine.mjs";
import { schemaManage } from "../../src/api/share.mjs";
import * as assert from "assert";

/**
 * @typedef {import("../types/core")}
 */
describe("test the engine module", () => {
    describe("test the createContext function", () => {
        it("should return the correct context object", () => {
            const schema = {
                type: "object",
                "#link": {
                    type: "string",
                },
            };

            const instance = {
                name: "John",
                age: 25,
            };
            const context = createContext(schema, instance);
            assert.deepStrictEqual(context.errors, []);
            assert.deepStrictEqual(context.instancePaths, []);
            assert.deepStrictEqual(context.schemaPaths, []);
            assert.deepStrictEqual(context.schemaData, {
                origin: schema,
                current: {
                    $ref: { root: schema },
                    key: "root",
                },
            });
            assert.deepStrictEqual(context.instanceData, {
                origin: instance,
                current: {
                    $ref: { root: instance },
                    key: "root",
                },
            });
            assert.deepStrictEqual(Object.keys(context.refSchemas).sort(), ["#", "#link"]);
        });
    });
    describe("test the enterContext function", () => {
        /**
         *
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                },
                {
                    name: "str",
                },
            );
        });
        it("should add instance key to instancePaths and update instanceData", () => {
            const instanceKey = "name";
            enterContext(context, undefined, instanceKey);
            assert.deepStrictEqual(context.instancePaths, [instanceKey]);
            assert.deepStrictEqual(context.schemaPaths, []);
            assert.equal(context.instanceData.current.$ref, context.instanceData.origin);
            assert.equal(context.schemaData.current.key, "root");
        });

        it("should add schema key to schemaPaths and update schemaData", () => {
            const schemaKey = "properties";

            enterContext(context, schemaKey);

            assert.deepStrictEqual(context.schemaPaths, [schemaKey]);
            assert.deepStrictEqual(context.instancePaths, []);
            assert.equal(context.schemaData.current.$ref, context.schemaData.origin);
            assert.equal(context.instanceData.current.key, "root");
        });

        it("should add schema key and schema key", () => {
            const schemaKey = "properties";
            const instanceKey = "name";

            enterContext(context, schemaKey, instanceKey);

            assert.deepStrictEqual(context.schemaPaths, [schemaKey]);
            assert.deepStrictEqual(context.instancePaths, [instanceKey]);
            assert.equal(context.schemaData.current.$ref, context.schemaData.origin);
            assert.equal(context.instanceData.current.$ref, context.instanceData.origin);
        });

        it("should not update instancePaths or instanceData if both instanceKey and schemaKey are undefined", () => {
            enterContext(context);
            assert.deepStrictEqual(context.schemaPaths, []);
            assert.deepStrictEqual(context.instancePaths, []);
            assert.equal(context.schemaData.current.key, "root");
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
            context = createContext(
                {
                    type: "object",
                    properties: {
                        name: { type: "string" },
                    },
                },
                {
                    name: "str",
                },
            );
        });
        it("should remove last element from instancePaths and schemaPaths", () => {
            enterContext(context, "properties", "name");
            backContext(context, "properties", "name");
            assert.deepStrictEqual(context.instancePaths, []);
            assert.deepStrictEqual(context.schemaPaths, []);
        });
        it("should remove last element from instancePaths", () => {
            enterContext(context, "properties", "name");
            backContext(context, undefined, "name");
            assert.deepStrictEqual(context.instancePaths, []);
            assert.deepStrictEqual(context.schemaPaths, ["properties"]);
        });
    });
    describe("test the startRefOrSchemaExecute function", () => {
        /**
         *
         * @type {Schema}
         */
        let schema;
        beforeEach(() => {
            schema = {
                type: "object",
                properties: {
                    isStringRef: { $ref: "#isStringRef" },
                    isRootRef: { $ref: "#" },
                    notFoundRef: { $ref: "#notFound" },
                },
                "#isStringRef": {
                    type: "string",
                },
            };
        });
        it("should execute schema successfully when property is a valid string $ref", () => {
            const context = createContext(schema, {
                isStringRef: "str",
            });
            enterContext(context, "properties");
            enterContext(context, "isStringRef", "isStringRef");
            const errors = startRefOrSchemaExecute(context);
            assert.equal(errors.length, 0);
        });

        it("should fail to execute schema when property is an invalid string $ref", () => {
            const context = createContext(schema, {
                isStringRef: true,
            });
            enterContext(context, "properties");
            enterContext(context, "isStringRef", "isStringRef");
            const errors = startRefOrSchemaExecute(context);
            assert.equal(errors.length, 1);
        });

        it("should execute schema successfully when property refers to a non-existent schema", () => {
            const context = createContext(schema, {});
            enterContext(context, "properties");
            enterContext(context, "notFoundRef", "notFoundRef");
            const errors = startRefOrSchemaExecute(context);
            assert.equal(errors.length, 0);
        });
        it("should execute schema successfully when property refers to an existing object, but is not a $ref", () => {
            const context = createContext(schema, {
                notFoundRef: true,
            });
            enterContext(context, "properties");
            enterContext(context, "notFoundRef", "notFoundRef");
            const errors = startRefOrSchemaExecute(context);
            assert.equal(errors.length, 0);
        });

        it("should execute schema successfully when property refers to an existing object that contains a valid $ref", () => {
            const context = createContext(schema, {
                isRootRef: {
                    isStringRef: "str",
                },
            });
            enterContext(context, "properties");
            enterContext(context, "notFoundRef", "notFoundRef");
            const errors = startRefOrSchemaExecute(context);
            assert.equal(errors.length, 0);
        });
        it("should fail to execute schema when property refers to an existing object that contains an invalid $ref", () => {
            const context = createContext(schema, {
                isRootRef: {
                    isStringRef: 1,
                },
            });
            enterContext(context, "properties");
            enterContext(context, "isRootRef", "isRootRef");
            const errors = startRefOrSchemaExecute(context);
            assert.equal(errors.length, 1);
        });
    });
});
