import { beforeEach, describe, it } from "node:test";
import { schemaManage, instanceManage } from "../../src/api/share.mjs";
import * as assert from "assert";

describe.only("test the instance module", () => {
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
    describe.only("schema is draft-01", () => {
        let schema;
        beforeEach(() => {
            schema = schemaManage.create({
                $schema: "http://json-schema.org/draft-01/schema#",
                type: "object",
                $id: "User",
                title: "user properties definition",
                description: "user properties definition",
                optional: false,
                additionalProperties: false,
                "#UserGroup": {
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
                            $ref: "#UserGroup",
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
        });
        it("should fail when instance is undefined", () => {
            const context = instanceManage.validate(schema, undefined);
            assert.equal(context.errors.length, 1);
        });

        it("should fail when instance is null", () => {
            const context = instanceManage.validate(schema, null);
            assert.equal(context.errors.length, 1);
        });

        it("should fail when instance is empty object", () => {
            const context = instanceManage.validate(schema, {});
            assert.equal(
                context.errors.every((x) => x.code === "optionalMustBeExists"),
                true,
            );
            assert.equal(context.errors.length > 1, true);
            assert.equal(context.instanceData.origin.age, 1);
        });

        it("should pass when instance is correct object", () => {
            const context = instanceManage.validate(schema, {
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
        it.only("should fail when the name property is empty string", () => {
            const context = instanceManage.validate(schema, {
                name: "",
            });
            assert.equal(filerErrorLength(context, ["name"], ["pattern", "minLength"]), 2);
        });

        it("should fail when the name property length constraint equal to limit", () => {
            const context = instanceManage.validate(schema, {
                name: "ddddddddddddddddddddddddddddddddd",
            });
            assert.equal(filerErrorLength(context, ["name"], ["maxLength"]), 1);
        });
        it("should fail when the gender property is not included in enum array", () => {
            const context = instanceManage.validate(schema, {
                gender: "test",
            });
            assert.equal(filerErrorLength(context, ["gender"], ["enum"]), 1);
        });

        it("should fail when the age property is constraint equal to limit", () => {
            const context = instanceManage.validate(schema, {
                age: 0,
            });
            assert.equal(filerErrorLength(context, ["age"], ["minimum"]), 1);
        });

        it("should fail when the age property is constraint equal to limit-1", () => {
            const context = instanceManage.validate(schema, {
                age: 101,
            });
            assert.equal(filerErrorLength(context, ["age"], ["maximum"]), 1);
        });

        it("should fail when the age property type is number", () => {
            const context = instanceManage.validate(schema, {
                age: 99.9,
            });
            assert.equal(filerErrorLength(context, ["age"], ["type"]), 1);
        });

        it("should fail when the email property is empty string", () => {
            const context = instanceManage.validate(schema, {
                email: "",
            });
            assert.equal(filerErrorLength(context, ["email"], ["format"]), 1);
        });

        it("should fail when the createdAt property is '-1'", () => {
            const context = instanceManage.validate(schema, {
                createdAt: "-1",
            });
            assert.equal(filerErrorLength(context, ["createdAt"], ["format"]), 1);
        });

        it("should fail when the createdAt property is null", () => {
            const context = instanceManage.validate(schema, {
                updatedAt: null,
            });
            assert.equal(filerErrorLength(context, ["updatedAt"]), 0);
        });
        it("should fail when the updatedAt property is null", () => {
            const context = instanceManage.validate(schema, {
                createdAt: null,
                updatedAt: null,
            });
            assert.equal(filerErrorLength(context, ["updatedAt"]), 1);
        });
        it("should fail when the userGroups property is empty array", () => {
            const context = instanceManage.validate(schema, {
                userGroups: [],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["minItems"]), 1);
        });

        it("should fail when the userGroups item type is boolean", () => {
            const context = instanceManage.validate(schema, {
                userGroups: [true],
            });
            assert.equal(filerErrorLength(context, undefined, ["type"], ["/userGroups/0"]), 1);
        });

        it("should fail when the userGroups property is constraint equal to limit", () => {
            const context = instanceManage.validate(schema, {
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
            const context = instanceManage.validate(schema, {
                userGroups: [{ groupName: "1" }, { groupName: 1 }, { groupName: true }, null],
            });
            assert.equal(filerErrorLength(context, ["groupName"], ["type"]), 2);
            assert.equal(filerErrorLength(context, undefined, ["type"], ["/userGroups/3"]), 1);
        });
        it("should pass when the extendInfo property is object", () => {
            const context = instanceManage.validate(schema, {
                extendInfo: { picture: null, isAdmin: true },
            });
            assert.equal(filerErrorLength(context, ["picture"]), 0);
            assert.equal(filerErrorLength(context, ["isAdmin"]), 0);
        });

        it("should pass when the picture property is uri", () => {
            const context = instanceManage.validate(schema, {
                extendInfo: { picture: "http://xx.com", isAdmin: true },
            });
            assert.equal(filerErrorLength(context, ["picture"]), 0);
            assert.equal(filerErrorLength(context, ["isAdmin"]), 0);
        });
    });
    describe("schema is draft-02 change", () => {
        let schema;
        beforeEach(() => {
            schema = schemaManage.create({
                $schema: "http://json-schema.org/draft-02/schema#",
                type: "object",
                $id: "User",
                title: "user properties definition",
                description: "user properties definition",
                optional: false,
                additionalProperties: false,
                "#UserGroup": {
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
                            $ref: "#UserGroup",
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
        });
        it("should pass when maxDecimal is lose efficacy", () => {
            const context = instanceManage.validate(schema, {
                balance: 0.007,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["maxDecimal"]), 0);
        });
        it("should pass validation when balance is 0.006", () => {
            const context = instanceManage.validate(schema, {
                balance: 0.006,
            });
            assert.equal(filerErrorLength(context, ["balance"]), 0);
        });
        it("should fail validation with divisibleBy error when balance is 0.007", () => {
            const context = instanceManage.validate(schema, {
                balance: 0.007,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["divisibleBy"]), 1);
        });
        it("should pass validation when balance is 0", () => {
            const context = instanceManage.validate(schema, {
                balance: 0,
            });
            assert.equal(filerErrorLength(context, ["balance"], ["divisibleBy"]), 0);
        });

        it("should fail validation with uniqueItems error when userGroups has duplicate groupName", () => {
            const context = instanceManage.validate(schema, {
                userGroups: [{ groupName: "test" }, { groupName: "test" }],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["uniqueItems"]), 1);
        });

        it("should pass validation when userGroups has unique groupNames", () => {
            const context = instanceManage.validate(schema, {
                userGroups: [{ groupName: "test" }, { groupName: "test1" }],
            });
            assert.equal(filerErrorLength(context, ["userGroups"], ["uniqueItems"]), 0);
        });
    });
    describe("schema is draft-03 change", () => {
        let schema;
        beforeEach(() => {
            schema = schemaManage.create({
                $schema: "http://json-schema.org/draft-03/schema#",
                type: "object",
                title: "user properties definition",
                description: "user properties definition",
                additionalProperties: false,
                "#UserGroup": {
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
                            $ref: "#UserGroup",
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
        });
        it("should report errors for 'area' array items exceeding maxLength", () => {
            const context = instanceManage.validate(schema, {
                area: ["area11", "area11", "area11"],
            });
            assert.equal(filerErrorLength(context, undefined, ["maxLength"], ["/area/1", "/area/2"]), 2);
        });
        it("should not report errors for 'area' array items within maxLength", () => {
            const context = instanceManage.validate(schema, {
                area: ["area11", "area", "area"],
            });
            assert.equal(filerErrorLength(context, undefined, ["maxLength"], ["/area/1", "/area/2"]), 0);
        });

        it("should not report required error for empty 'name' and optional 'gender'", () => {
            const context = instanceManage.validate(schema, {
                name: "",
            });
            assert.equal(filerErrorLength(context, ["required"], ["name"]), 0);
            assert.equal(filerErrorLength(context, ["optional"], ["gender"]), 0);
        });

        it("should report error for 'updatedAt' without matching 'createdAt' dependency", () => {
            const context = instanceManage.validate(schema, {
                updatedAt: "1122",
            });
            assert.equal(filerErrorLength(context, undefined, ["updatedAt"]), 1);
        });

        it("should not report error when both 'updatedAt' and 'createdAt' are provided", () => {
            const context = instanceManage.validate(schema, {
                updatedAt: "1122",
                createdAt: "1122",
            });
            assert.equal(filerErrorLength(context, undefined, ["updatedAt"]), 0);
        });
        it("should report maxLength errors for 'name' and 'age' exceeding limit", () => {
            const context = instanceManage.validate(schema, {
                name: "11111111111111111111111111111",
                age: "11111111111111111111111111111",
            });
            assert.equal(filerErrorLength(context, ["name", "age"], ["maxLength"]), 2);
        });
        it("should not report maxLength errors for valid 'name' and 'age' values", () => {
            const context = instanceManage.validate(schema, {
                name: "test",
                age: "man",
            });
            assert.equal(filerErrorLength(context, ["name", "age"], ["maxLength"]), 0);
        });
    });

    describe("schema is draft-03 change", () => {
        let schema;
        beforeEach(() => {
            schema = schemaManage.create({
                $schema: "http://json-schema.org/draft-04/schema#",
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
        });
        it("should pass validation", () => {
            const context = instanceManage.validate(schema, {
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
            const context = instanceManage.validate(schema, {
                name: "test",
            });
            assert.equal(filerErrorLength(context, ["name"], ["not"]), 1);
        });

        it("should fail validation when age is 101", () => {
            const context = instanceManage.validate(schema, {
                age: 101,
            });
            assert.equal(filerErrorLength(context, ["age"], ["allOf"]), 1);
        });
        it("should fail validation when age is xxxxxxx", () => {
            const context = instanceManage.validate(schema, {
                email: "xxxxxxx",
            });
            assert.equal(filerErrorLength(context, ["email"], ["anyOf"]), 1);
        });
    });
});
