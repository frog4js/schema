import { before, beforeEach, describe, it } from "node:test";
import { vocabularyActuatorManage } from "../../src/vocabulary-actuator/share.mjs";
import { schemaManage } from "../../src/schema/share.mjs";
import { contextManage } from "../../src/context/share.mjs";
import * as assert from "assert";
import { versionConstant, vocabularyActuatorConstant } from "../../src/constants/share.mjs";

/**
 * @typedef {import("../../types/share")}
 */
describe.only("test the all draft version", () => {
    /**
     *
     * @param {Context} context
     * @param {Array<string>} [currentInstanceKeys]
     * @param {Array<string>} [currentSchemaKeys]
     * @param {Array<string>} [instancePaths]
     * @return {number}
     */
    function filerErrorLength(context, currentInstanceKeys, currentSchemaKeys, instancePaths) {
        return context.errors.filter((x) => {
            let state = true;
            if (state && currentInstanceKeys) {
                state = currentInstanceKeys.includes(x.currentInstanceKey);
            }
            if (state && currentSchemaKeys) {
                state = currentSchemaKeys.includes(x.currentSchemaKey);
            }
            if (state && instancePaths) {
                state = instancePaths.includes(x.instancePath);
            }
            return state;
        }).length;
    }

    describe("schema is draft-01", () => {
        let context;
        before(() => {
            context = contextManage.create({
                $schema: "http://json-schema.org/draft-01/schema#",
            });
            try {
                schemaManage.setMainSchema(context, {
                    type: "object",
                    $id: "User",
                    title: "user properties definition",
                    description: "user properties definition",
                    optional: false,
                    additionalProperties: false,
                    UserGroup: {
                        type: "object",
                        properties: {
                            groupName: { type: "string" },
                        },
                    },
                    properties: {
                        name: {
                            type: "string",
                            maxLength: 20,
                            minLength: 1,
                            pattern: "[a-zA-z]{1,}",
                            optional: false,
                            title: "user name",
                        },
                        gender: {
                            type: "string",
                            enum: ["man", "woman"],
                            optional: false,
                            title: "user gender, man or woman",
                        },
                        age: {
                            type: "integer",
                            maximum: 100,
                            minimum: 1,
                            default: 1,
                            optional: true,
                        },
                        email: {
                            type: "string",
                            format: "email",
                            optional: true,
                        },
                        createdAt: {
                            type: "string",
                            format: "utc-millisec",
                        },
                        updatedAt: {
                            type: "string",
                            format: "utc-millisec",
                            requires: "createdAt",
                        },
                        userGroups: {
                            type: "array",
                            items: {
                                $ref: "#/UserGroup",
                            },
                            maxItems: 5,
                            minItems: 1,
                        },
                        area: {
                            type: ["array", "string"],
                            items: {
                                type: "string",
                            },
                            maxItems: 3,
                            minItems: 3,
                            pattern: "[^,]*,[^,]*,[^,]*",
                        },
                        balance: {
                            type: "number",
                            maxDecimal: 2,
                            default: 0,
                        },
                        extendInfo: {
                            type: "object",
                            properties: {
                                picture: {
                                    type: ["string", "null"],
                                    format: "uri",
                                },
                                isAdmin: {
                                    type: "boolean",
                                    default: false,
                                },
                            },
                            optional: true,
                            default: {
                                picture: null,
                                isAdmin: false,
                            },
                        },
                    },
                });
                schemaManage.compile(context);
            } catch (e) {
                console.log(e);
            }
        });
        it("should fail when instance is undefined", () => {
            const { errors } = vocabularyActuatorManage.validate(context, undefined);
            assert.equal(errors.length, 1);
        });

        it("should fail when instance is null", () => {
            const { errors } = vocabularyActuatorManage.validate(context, null);
            assert.equal(errors.length, 1);
        });

        it("should fail when instance is empty object", () => {
            const { errors } = vocabularyActuatorManage.validate(context, {});
            assert.equal(
                errors.every((x) => x.currentSchemaKey === vocabularyActuatorConstant.keys.optional),
                true,
            );
            assert.equal(errors.length > 1, true);
            assert.equal(context.instanceData.origin.age, 1);
        });

        it("should pass when instance is correct object", () => {
            vocabularyActuatorManage.validate(context, {
                name: "test",
                age: 4,
                gender: "man",
                email: "xxx@test.com",
                createdAt: Date.now().toString(),
                updatedAt: Date.now().toString(),
                userGroups: [{ groupName: "group1" }],
                area: ["jx", "yc", "sg"],
                balance: 0.12,
                extendInfo: {
                    isAdmin: true,
                    picture: "http://xxx.com",
                },
            });
            assert.equal(filerErrorLength(context), 0);
        });
        it("should fail when the name property is empty string", () => {
            vocabularyActuatorManage.validate(context, {
                name: "",
            });
            assert.equal(filerErrorLength(context, ["name"], ["pattern", "minLength"]), 2);
        });

        it("should fail when the name property length constraint equal to limit", () => {
            vocabularyActuatorManage.validate(context, {
                name: "ddddddddddddddddddddddddddddddddd",
            });
            assert.equal(filerErrorLength(context, ["name"], ["maxLength"]), 1);
        });
        it("should fail when the gender property is not included in enum array", () => {
            vocabularyActuatorManage.validate(context, {
                gender: "test",
            });
            assert.equal(filerErrorLength(context, ["gender"], ["enum"]), 1);
        });

        it("should fail when the age property is constraint equal to limit", () => {
            vocabularyActuatorManage.validate(context, {
                age: 0,
            });
            assert.equal(filerErrorLength(context, ["age"], ["minimum"]), 1);
        });

        it("should fail when the age property is constraint equal to limit-1", () => {
            vocabularyActuatorManage.validate(context, {
                age: 101,
            });
            assert.equal(filerErrorLength(context, ["age"], ["maximum"]), 1);
        });

        it("should fail when the age property type is number", () => {
            vocabularyActuatorManage.validate(context, {
                age: 99.9,
            });
            assert.equal(filerErrorLength(context, ["age"], ["type"]), 1);
        });

        it("should fail when the email property is empty string", () => {
            vocabularyActuatorManage.validate(context, {
                email: "",
            });
            assert.equal(filerErrorLength(context, ["email"], ["format"]), 1);
        });

        it("should fail when the createdAt property is '-1'", () => {
            vocabularyActuatorManage.validate(context, {
                createdAt: "-1",
            });
            assert.equal(filerErrorLength(context, ["createdAt"], ["format"]), 1);
        });

        it("should fail when the createdAt property is null", () => {
            vocabularyActuatorManage.validate(context, {
                updatedAt: null,
            });
            assert.equal(filerErrorLength(context, ["updatedAt"]), 0);
        });
        it("should fail when the updatedAt property is null", () => {
            vocabularyActuatorManage.validate(context, {
                createdAt: null,
                updatedAt: null,
            });
            assert.equal(filerErrorLength(context, ["updatedAt"]), 1);
        });
        it("should fail when the userGroups property is empty array", () => {
            vocabularyActuatorManage.validate(context, {
                userGroups: [],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["minItems"]), 1);
        });

        it("should fail when the userGroups item type is boolean", () => {
            vocabularyActuatorManage.validate(context, {
                userGroups: [true],
            });
            assert.equal(filerErrorLength(context, undefined, ["type"], ["/userGroups/0"]), 1);
        });

        it("should fail when the userGroups property is constraint equal to limit", () => {
            vocabularyActuatorManage.validate(context, {
                userGroups: [
                    { groupName: "1" },
                    { groupName: "1" },
                    { groupName: "1" },
                    { groupName: "1" },
                    { groupName: "1" },
                    { groupName: "1" },
                ],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["maxItems"]), 1);
        });

        it("should fail when the userGroups item is null", () => {
            vocabularyActuatorManage.validate(context, {
                userGroups: [{ groupName: "1" }, { groupName: 1 }, { groupName: true }, null],
            });
            assert.equal(filerErrorLength(context, ["groupName"], ["type"]), 2);
            assert.equal(filerErrorLength(context, undefined, ["type"], ["/userGroups/3"]), 1);
        });
        it("should pass when the extendInfo property is object", () => {
            vocabularyActuatorManage.validate(context, {
                extendInfo: { picture: null, isAdmin: true },
            });
            assert.equal(filerErrorLength(context, ["picture"]), 0);
            assert.equal(filerErrorLength(context, ["isAdmin"]), 0);
        });

        it("should pass when the picture property is uri", () => {
            vocabularyActuatorManage.validate(context, {
                extendInfo: { picture: "http://xx.com", isAdmin: true },
            });
            assert.equal(filerErrorLength(context, ["picture"]), 0);
            assert.equal(filerErrorLength(context, ["isAdmin"]), 0);
        });
    });
    describe("schema is draft-02 change", () => {
        let context;
        before(() => {
            context = contextManage.create({
                $schema: "http://json-schema.org/draft-02/schema#",
            });
            schemaManage.setMainSchema(context, {
                type: "object",
                $id: "User",
                title: "user properties definition",
                description: "user properties definition",
                optional: false,
                additionalProperties: false,
                UserGroup: {
                    type: "object",
                    properties: {
                        groupName: { type: "string" },
                    },
                },
                properties: {
                    name: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1,
                        pattern: "[a-zA-z]{1,}",
                        optional: false,
                        title: "user name",
                    },
                    gender: {
                        type: "string",
                        enum: ["man", "woman"],
                        optional: false,
                        title: "user gender, man or woman",
                    },
                    age: {
                        type: "integer",
                        maximum: 100,
                        minimum: 1,
                        default: 1,
                        optional: true,
                    },
                    email: {
                        type: "string",
                        format: "email",
                        optional: true,
                    },
                    createdAt: {
                        type: "string",
                        format: "utc-millisec",
                    },
                    updatedAt: {
                        type: "string",
                        format: "utc-millisec",
                        requires: "createdAt",
                    },
                    userGroups: {
                        type: "array",
                        items: {
                            $ref: "#/UserGroup",
                        },
                        uniqueItems: true,
                        maxItems: 5,
                        minItems: 1,
                    },
                    area: {
                        type: ["array", "string"],
                        items: {
                            type: "string",
                        },
                        maxItems: 3,
                        minItems: 3,
                        pattern: "[^,]*,[^,]*,[^,]*",
                    },
                    balance: {
                        type: "number",
                        maxDecimal: 2,
                        divisibleBy: 0.003,
                        default: 0,
                    },
                    extendInfo: {
                        type: "object",
                        properties: {
                            picture: {
                                type: ["string", "null"],
                                format: "uri",
                            },
                            isAdmin: {
                                type: "boolean",
                                default: false,
                            },
                        },
                        optional: true,
                        default: {
                            picture: null,
                            isAdmin: false,
                        },
                    },
                },
            });
            schemaManage.compile(context);
        });
        it("should pass when maxDecimal is lose efficacy", () => {
            vocabularyActuatorManage.validate(context, {
                balance: 0.007,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["maxDecimal"]), 0);
        });
        it("should pass validation when balance is 0.006", () => {
            vocabularyActuatorManage.validate(context, {
                balance: 0.006,
            });
            assert.equal(filerErrorLength(context, ["balance"]), 0);
        });
        it("should fail validation with divisibleBy error when balance is 0.007", () => {
            vocabularyActuatorManage.validate(context, {
                balance: 0.007,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["divisibleBy"]), 1);
        });
        it("should pass validation when balance is 0", () => {
            vocabularyActuatorManage.validate(context, {
                balance: 0,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["divisibleBy"]), 0);
        });

        it("should fail validation with uniqueItems error when userGroups has duplicate groupName", () => {
            vocabularyActuatorManage.validate(context, {
                userGroups: [{ groupName: "test" }, { groupName: "test" }],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["uniqueItems"]), 1);
        });

        it("should pass validation when userGroups has unique groupNames", () => {
            vocabularyActuatorManage.validate(context, {
                userGroups: [{ groupName: "test" }, { groupName: "test1" }],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["uniqueItems"]), 0);
        });
    });
    describe("schema is draft-03 change", () => {
        let context;
        before(() => {
            context = contextManage.create({
                $schema: "http://json-schema.org/draft-03/schema#",
            });
            schemaManage.setMainSchema(context, {
                type: "object",
                title: "user properties definition",
                description: "user properties definition",
                additionalProperties: false,
                UserGroup: {
                    type: "object",
                    properties: {
                        groupName: { type: "string" },
                    },
                },
                required: true,
                properties: {
                    name: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1,
                        pattern: "[a-zA-z]{1,}",
                        required: true,
                        title: "user name",
                    },
                    gender: {
                        type: "string",
                        enum: ["man", "woman"],
                        optional: false,
                        title: "user gender, man or woman",
                    },
                    age: {
                        type: "integer",
                        maximum: 100,
                        minimum: 1,
                        default: 1,
                        required: true,
                    },
                    email: {
                        type: "string",
                        format: "email",
                    },
                    createdAt: {
                        type: "string",
                        format: "utc-millisec",
                    },
                    updatedAt: {
                        type: "string",
                        format: "utc-millisec",
                    },
                    userGroups: {
                        type: "array",
                        items: {
                            $ref: "#/UserGroup",
                        },
                        uniqueItems: true,
                        maxItems: 5,
                        minItems: 1,
                    },
                    area: {
                        type: ["array", "string"],
                        items: [
                            {
                                type: "string",
                            },
                        ],
                        additionalItems: {
                            type: "string",
                            maxLength: 4,
                        },
                        maxItems: 3,
                        minItems: 3,
                        pattern: "[^,]*,[^,]*,[^,]*",
                    },
                    balance: {
                        type: "number",
                        divisibleBy: 0.003,
                        default: 0,
                    },
                    extendInfo: {
                        type: "object",
                        properties: {
                            picture: {
                                type: ["string", "null"],
                                format: "uri",
                            },
                            isAdmin: {
                                type: "boolean",
                                default: false,
                            },
                        },
                        required: false,
                        default: {
                            picture: null,
                            isAdmin: false,
                        },
                    },
                },
                dependencies: {
                    updatedAt: "createdAt",
                },
                patternProperties: {
                    "name|gender": {
                        maxLength: 20,
                    },
                },
            });
            schemaManage.compile(context);
        });
        it("should report errors for 'area' array items exceeding maxLength", () => {
            vocabularyActuatorManage.validate(context, {
                area: ["area11", "area11", "area11"],
            });
            assert.equal(filerErrorLength(context, undefined, ["maxLength"], ["/area/1", "/area/2"]), 2);
        });
        it("should not report errors for 'area' array items within maxLength", () => {
            vocabularyActuatorManage.validate(context, {
                area: ["area11", "area", "area"],
            });
            assert.equal(filerErrorLength(context, undefined, ["maxLength"], ["/area/1", "/area/2"]), 0);
        });

        it("should not report required error for empty 'name' and optional 'gender'", () => {
            vocabularyActuatorManage.validate(context, {
                name: "",
            });
            assert.equal(filerErrorLength(context, ["required"], ["name"]), 0);
            assert.equal(filerErrorLength(context, ["optional"], ["gender"]), 0);
        });

        it("should report error for 'updatedAt' without matching 'createdAt' dependency", () => {
            vocabularyActuatorManage.validate(context, {
                updatedAt: "1122",
            });
            assert.equal(filerErrorLength(context, undefined, ["dependencies"]), 1);
        });

        it("should not report error when both 'updatedAt' and 'createdAt' are provided", () => {
            vocabularyActuatorManage.validate(context, {
                updatedAt: "1122",
                createdAt: "1122",
            });
            assert.equal(filerErrorLength(context, undefined, ["updatedAt"]), 0);
        });
        it("should report maxLength errors for 'name' and 'age' exceeding limit", () => {
            vocabularyActuatorManage.validate(context, {
                name: "11111111111111111111111111111",
                age: "11111111111111111111111111111",
            });
            assert.equal(filerErrorLength(context, ["name", "age"], ["maxLength"]), 2);
        });
        it("should not report maxLength errors for valid 'name' and 'age' values", () => {
            vocabularyActuatorManage.validate(context, {
                name: "test",
                age: "man",
            });
            assert.equal(filerErrorLength(context, ["name", "age"], ["maxLength"]), 0);
        });
    });

    describe("schema is draft-04 change", () => {
        let context;
        before(() => {
            context = contextManage.create({
                $schema: "http://json-schema.org/draft-04/schema#",
            });
            schemaManage.setMainSchema(context, {
                type: "object",
                title: "user properties definition",
                description: "user properties definition",
                additionalProperties: false,
                definitions: {
                    UserGroup: {
                        type: "object",
                        properties: {
                            groupName: { type: "string" },
                        },
                    },
                },
                required: ["name", "age"],
                properties: {
                    name: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1,
                        not: {
                            pattern: "^[a-zA-z]{1,}",
                        },
                        title: "user name",
                    },
                    gender: {
                        type: "string",
                        oneOf: [
                            {
                                enum: ["man"],
                            },
                            {
                                enum: ["woman"],
                            },
                        ],
                        title: "user gender, man or woman",
                    },
                    age: {
                        type: "integer",
                        allOf: [
                            {
                                maximum: 100,
                            },
                            {
                                minimum: 1,
                            },
                        ],
                        default: 1,
                    },
                    email: {
                        anyOf: [
                            {
                                type: "string",
                                format: "email",
                            },
                            {
                                type: "string",
                                maxLength: 3,
                            },
                        ],
                    },
                    createdAt: {
                        type: "integer",
                    },
                    updatedAt: {
                        type: "integer",
                    },
                    userGroups: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/UserGroup",
                        },
                        uniqueItems: true,
                        maxItems: 5,
                        minItems: 1,
                    },
                    balance: {
                        type: "integer",
                        multipleOf: 2,
                        default: 0,
                    },
                },
                dependencies: {
                    updatedAt: ["createdAt"],
                },
            });
            schemaManage.compile(context);
        });

        it("should pass validation", () => {
            vocabularyActuatorManage.validate(context, {
                name: "1test",
                age: 30,
                gender: "man",
                email: "1@xxx.com",
                createdAt: 1,
                updatedAt: 1,
                userGroups: [{ groupName: "test" }],
                balance: 10,
            });
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when name is test", () => {
            vocabularyActuatorManage.validate(context, {
                name: "test",
            });
            assert.equal(filerErrorLength(context, ["name"], ["not"]), 1);
        });

        it("should fail validation when age is 101", () => {
            vocabularyActuatorManage.validate(context, {
                age: 101,
            });
            assert.equal(filerErrorLength(context, ["age"], ["allOf"]), 1);
        });
        it("should fail validation when age is xxxxxxx", () => {
            vocabularyActuatorManage.validate(context, {
                email: "xxxxxxx",
            });
            assert.equal(filerErrorLength(context, ["email"], ["anyOf"]), 1);
        });
    });
    describe("schema is draft-05 change", () => {
        let context;
        before(() => {
            context = contextManage.create({
                $schema: "http://json-schema.org/draft-05/schema#",
            });

            schemaManage.setMainSchema(context, {
                type: "object",
                title: "user properties definition",
                description: "user properties definition",
                additionalProperties: false,
                definitions: {
                    UserGroup: {
                        type: "object",
                        properties: {
                            groupName: { type: "string" },
                        },
                    },
                },
                required: ["name", "age"],
                properties: {
                    name: {
                        type: "string",
                        maxLength: 20,
                        minLength: 1,
                        not: {
                            pattern: "^[a-zA-z]{1,}",
                        },
                        title: "user name",
                    },
                    gender: {
                        type: "string",
                        oneOf: [
                            {
                                enum: ["man"],
                            },
                            {
                                enum: ["woman"],
                            },
                        ],
                        title: "user gender, man or woman",
                    },
                    age: {
                        type: "integer",
                        allOf: [
                            {
                                maximum: 100,
                            },
                            {
                                minimum: 1,
                            },
                        ],
                        default: 1,
                    },
                    email: {
                        anyOf: [
                            {
                                type: "string",
                                format: "email",
                            },
                            {
                                type: "string",
                                maxLength: 3,
                            },
                        ],
                    },
                    createdAt: {
                        type: "integer",
                    },
                    updatedAt: {
                        type: "integer",
                    },
                    userGroups: {
                        type: "array",
                        items: {
                            $ref: "#/definitions/UserGroup",
                        },
                        uniqueItems: true,
                        maxItems: 5,
                        minItems: 1,
                    },
                    balance: {
                        type: "integer",
                        multipleOf: 2,
                        default: 0,
                    },
                },
                dependencies: {
                    updatedAt: ["createdAt"],
                },
            });

            schemaManage.compile(context);
        });

        it("should pass validation", () => {
            vocabularyActuatorManage.validate(context, {
                name: "1test",
                age: 30,
                gender: "man",
                email: "1@xxx.com",
                createdAt: 1,
                updatedAt: 1,
                userGroups: [{ groupName: "test" }],
                balance: 10,
            });
            assert.equal(context.errors.length, 0);
        });
    });
    describe("schema is draft-05 change", () => {
        let context;
        before(() => {
            context = contextManage.create({
                $schema: "http://json-schema.org/draft-06/schema#",
            });
            schemaManage.addReferenceSchema(context, {
                $id: "UserGroup",
                type: "object",
                properties: {
                    groupName: { type: "string" },
                },
                required: [],
            });
            schemaManage.setMainSchema(context, {
                $id: "User",
                type: "object",
                title: "user properties definition",
                description: "user properties definition",
                additionalProperties: false,
                required: ["name", "age"],
                properties: {
                    name: {
                        type: "string",
                        examples: ["test"],
                    },
                    gender: {
                        type: "string",
                        examples: ["man", "woman"],
                    },
                    age: {
                        type: "integer",
                        const: 1,
                    },
                    userGroups: {
                        type: "array",
                        items: {
                            $ref: "UserGroup",
                        },
                    },
                    extInfo: {
                        type: "object",
                        propertyNames: {
                            format: "ipv4",
                        },
                    },
                    balance: {
                        type: "number",
                        exclusiveMaximum: 3,
                        exclusiveMinimum: 1,
                    },
                },
            });
            schemaManage.compile(context);
        });

        it("should pass validation", () => {
            vocabularyActuatorManage.validate(context, {
                name: "test",
                age: 1,
                gender: "man",
                userGroups: [{}],
                extInfo: {
                    "127.0.0.1": 1,
                    "127.0.0.2": 10,
                },
                balance: 2,
            });
            assert.equal(context.version, versionConstant.jsonSchemaVersions.draft06);
            assert.equal(Object.keys(context.referenceSchemas).length, 4);
            assert.equal(context.errors.length, 0);
        });

        it("should fail validation when const value is error", () => {
            vocabularyActuatorManage.validate(context, {
                age: 2,
            });
            assert.equal(filerErrorLength(context, ["age"], ["const"]), 1);
        });

        it("should fail validation when propertyNames value is error", () => {
            vocabularyActuatorManage.validate(context, {
                extInfo: {
                    "127.0.0.1": "1",
                    aaa: 2,
                },
            });
            assert.equal(filerErrorLength(context, ["extInfo"], ["propertyNames"]), 1);
        });

        it("should fail validation when exclusiveMaximum value is error", () => {
            vocabularyActuatorManage.validate(context, {
                balance: 3,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["exclusiveMaximum"]), 1);
        });
        it("should fail validation when exclusiveMinimum value is error", () => {
            vocabularyActuatorManage.validate(context, {
                balance: 1,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["exclusiveMinimum"]), 1);
        });
    });
});
