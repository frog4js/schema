import { describe, it, beforeEach, before } from "node:test";
import {
    pushError,
    setLogError,
    mergeError,
    getCurrentInstanceRefData,
    getParentInstance,
    getParentSchema,
    getCurrentSchemaRefData,
    getSiblingInstanceRefData,
    getSiblingSchemaRefData,
} from "../../src/core/helper.mjs";
import { executeConstant } from "../../src/constants/share.mjs";
import { createContext, enterContext, backContext } from "../../src/core/engine.mjs";
import * as assert from "assert";

describe("test the helper module", () => {
    let schema;
    before(() => {
        schema = {
            type: "object",
            properties: {
                array: { type: "array", items: { $ref: "#arrayItem" } },
            },
            "#arrayItem": {
                type: "object",
                properties: {
                    name: { type: "string" },
                    age: { type: "number" },
                },
            },
        };
    });
    describe("test the pushError function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should add an error to the context errors array when isTemp is false", () => {
            enterContext(context, "properties");
            enterContext(context, "array");
            enterContext(context, "items");
            enterContext(context, executeConstant.pathKeys.ref);
            enterContext(context, "#arrayItem");
            enterContext(context, "properties");
            enterContext(context, "name");
            enterContext(context, "type");
            enterContext(context, undefined, "array");
            enterContext(context, undefined, 0);
            enterContext(context, undefined, "name");
            // 调用目标函数
            pushError(context, "typeMustBeOfTheType");
            assert.deepStrictEqual(context.errors, [
                {
                    instancePath: "/array/0/name",
                    schemaPath: "#/properties/array/items/#arrayItem/properties/name/type",
                    currentSchemaKey: "type",
                    currentSchemaValue: "string",
                    currentInstanceKey: "name",
                    currentInstanceValue: true,
                    message: "must be of the type",
                    code: "typeMustBeOfTheType",
                },
            ]);
            assert.equal(context.tempErrors.length, 0);
        });

        it("should add an error to the context tempErrors array when isTemp is true", () => {
            setLogError(context, true);
            enterContext(context, "type");
            pushError(context, "typeMustBeOfTheType");
            assert.equal(context.errors.length, 0);
            assert.deepStrictEqual(context.tempErrors, [
                {
                    instancePath: "",
                    schemaPath: "#/type",
                    currentSchemaKey: "type",
                    currentSchemaValue: "object",
                    currentInstanceKey: "root",
                    currentInstanceValue: {
                        array: [
                            {
                                name: true,
                                age: 1,
                            },
                        ],
                    },
                    message: "must be of the type",
                    code: "typeMustBeOfTheType",
                },
            ]);
        });
    });
    describe("test the setLogError function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should set errorState to temporary error mode when isTempError is true and errorState.isTemp is false", () => {
            enterContext(context, "type");
            const result = setLogError(context, true);
            assert.equal(result, true);
            assert.equal(context.errorState.isTemp, true);
            assert.equal(context.errorState.lockKey, "type");
        });

        it("should set errorState to non-temporary error mode when isTempError is false and errorState.isTemp is true and lockKey matches schemaPaths", () => {
            enterContext(context, "type");
            setLogError(context, true);

            const result = setLogError(context, false);

            assert.equal(result, true);
            assert.equal(context.errorState.isTemp, false);
            assert.equal(context.errorState.lockKey, "");
        });

        it("should return false when no state change is made", () => {
            enterContext(context, "properties");
            setLogError(context, true);
            enterContext(context, "array");
            const result = setLogError(context, false);

            assert.equal(result, false);
            assert.equal(context.errorState.isTemp, true);
            assert.equal(context.errorState.lockKey, "properties");
        });
    });
    describe("test the mergeError function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should merge errors into the context errors array", () => {
            const errors = [
                {
                    instancePath: "/path1/path2",
                    schemaPath: "#/schema1/schema2",
                    currentSchemaKey: "schemaKey",
                    currentInstanceKey: "instanceKey",
                    message: "errorMessage",
                    expected: "expectedValue",
                    code: "errorCode",
                },
                {
                    instancePath: "/path3/path4",
                    schemaPath: "#/schema3/schema4",
                    currentSchemaKey: "schemaKey2",
                    currentInstanceKey: "instanceKey2",
                    message: "errorMessage2",
                    expected: "expectedValue2",
                    code: "errorCode2",
                },
            ];

            // 调用目标函数
            mergeError(context, errors);

            // 断言预期结果
            assert.equal(context.errors.length, 2);
            assert.deepEqual(context.errors[0], errors[0]);
            assert.deepEqual(context.errors[1], errors[1]);
        });
    });

    describe("test the getCurrentInstanceRefData function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should return root reference data when instancePaths is empty", () => {
            const result = getCurrentInstanceRefData(context);

            assert.deepEqual(result, {
                $ref: { root: context.instanceData.origin },
                key: "root",
            });
        });

        it("should return current and key reference data when instancePaths is not empty", () => {
            enterContext(context, undefined, "array");
            const result = getCurrentInstanceRefData(context);

            assert.deepEqual(result, {
                $ref: context.instanceData.origin,
                key: "array",
            });
        });
    });

    describe("test the getParentInstance function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should return the parent instance", () => {
            enterContext(context, undefined, "array");
            enterContext(context, undefined, 0);
            enterContext(context, undefined, "name");

            const result = getParentInstance(context);

            assert.deepEqual(result, context.instanceData.origin.array[0]);
        });
    });

    describe("test the getCurrentSchemaRefData function", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should return root reference data when schemaPaths is empty", () => {
            const result = getCurrentSchemaRefData(context);

            assert.deepEqual(result, {
                $ref: { root: context.schemaData.origin },
                key: "root",
            });
        });

        it("should return current and key reference data when schemaPaths is not empty", () => {
            enterContext(context, "type");
            const result = getCurrentSchemaRefData(context);

            assert.deepEqual(result, {
                $ref: context.schemaData.origin,
                key: "type",
            });
        });
    });

    describe("test the getParentSchema function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should return the parent schema", () => {
            enterContext(context, "properties");
            enterContext(context, "array");
            enterContext(context, "items");
            enterContext(context, executeConstant.pathKeys.ref);
            enterContext(context, "#arrayItem");
            enterContext(context, "properties");
            enterContext(context, "name");
            enterContext(context, "type");
            const result = getParentSchema(context);

            assert.deepEqual(result, context.schemaData.origin["#arrayItem"].properties.name);
        });
    });
    describe("test the getSiblingSchemaRefData function ", () => {
        /**
         * @type {Context}
         */
        let context;
        beforeEach(() => {
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should return correct sibling schema ref data for schema paths is empty array", () => {
            let data = getSiblingSchemaRefData(context, "test");
            assert.deepEqual(data.key, "root");
        });

        it("should correctly update context and return sibling schema ref data for 'type' key", () => {
            enterContext(context, "properties");
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
            context = createContext(schema, { array: [{ name: true, age: 1 }] });
        });
        it("should return correct sibling instance ref data for instance paths is empty array", () => {
            let data = getSiblingInstanceRefData(context, "test");
            assert.deepEqual(data.key, "root");
        });

        it("should correctly update context and return instance schema ref data for 'name' key", () => {
            enterContext(context, undefined, "array");
            enterContext(context, undefined, 0);
            enterContext(context, undefined, "name");
            let data = getSiblingInstanceRefData(context, "name");
            assert.equal(data.key, "name");
            assert.equal(data.$ref[data.key], true);
        });
    });
});
