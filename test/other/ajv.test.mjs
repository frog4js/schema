import { describe, it, beforeEach } from "node:test";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { contextManage } from "../../src/context/share.mjs";
import { schemaManage } from "../../src/schema/share.mjs";
import { vocabularyActuatorManage } from "../../src/vocabulary-actuator/share.mjs";
import { vocabularyActuatorConstant } from "../../src/constants/share.mjs";

describe("test the ajv", () => {
    it("ajv1", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });
        addFormats(ajv);

        const schema = {
            // $schema: "http://json-schema.org/draft-03/schema#",
            type: "object",
            dependencies: {
                age: ["email", "gender"],
            },
        };
        const data = {};

        const validate = ajv.compile(schema);
        validate(data);
        console.log(validate.errors);
    });

    it("ajv2", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });
        addFormats(ajv);

        const schema = {
            type: "object",
            $id: "User",
            title: "user properties definition",
            description: "user properties definition",
            additionalProperties: false,

            properties: {
                name: {
                    type: "string",
                    maxLength: 20,
                    minLength: 1,
                    pattern: "[a-zA-z]{1,}",
                    title: "user name",
                },
                gender: {
                    type: "string",
                    enum: ["man", "woman"],
                    title: "user gender, man or woman",
                },
                age: {
                    type: "integer",
                    maximum: 100,
                    minimum: 1,
                    default: 1,
                },
                email: {
                    type: "string",
                    format: "email",
                },
                createdAt: {
                    type: "string",
                },
                updatedAt: {
                    type: "string",
                },
                userGroups: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            groupName: { type: "string" },
                        },
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
                    default: {
                        picture: null,
                        isAdmin: false,
                    },
                },
            },
        };

        const data = {
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
        };

        const validate = ajv.compile(schema);
    });
    it("diff-current", () => {
        const json = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "object",
            $id: "User",
            title: "user properties definition",
            description: "user properties definition",
            additionalProperties: false,
            definitions: {
                a: {
                    type: "string",
                },
            },
            properties: {
                name: {
                    type: "number",
                    default: 22,
                },
                age: {
                    type: "object",
                    properties: {
                        a: {
                            $ref: "#/definitions/a",
                        },
                    },
                    default: {
                        a: "222",
                    },
                },
            },
        };

        const data = {
            name: 1,
        };

        const context = contextManage.create();
        schemaManage.setMainSchema(context, json);
        console.log(context.instanceData.origin[vocabularyActuatorConstant.flags.isSchema]);
    });

    it("diff-ajv", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });

        function generateRandomString(length) {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }

            return result;
        }

        const schema = {
            type: "object",
            $id: "User",
            title: "user properties definition",
            description: "user properties definition",
            additionalProperties: false,
            properties: {
                names: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                },
            },
        };

        const data = {
            names: [],
        };
        for (let i = 0; i < 10; i++) {
            data.names.push(generateRandomString(500000));
        }
        const start = Date.now();
        const validate = ajv.compile(schema);
        validate(data);
    });
});
