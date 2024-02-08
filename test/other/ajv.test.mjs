import { describe, it, beforeEach } from "node:test";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { contextManage } from "../../src/context/share.mjs";
import { schemaManage } from "../../src/schema/share.mjs";

describe.only("test the ajv", () => {
    it.only("ajv1", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });
        addFormats(ajv);

        const schema = {
            $id: "#/abcd",
            $defs: {
                a: { type: "string" },
            },
            type: "object",
            properties: {
                name: {
                    $defs: {
                        a: { type: "number" },
                    },
                    default: "1",
                },
                age: {
                    $ref: "#/abc/properties/name",
                },
            },
            required: ["age", "name"],
        };
        ajv.addSchema({
            $id: "#/a",
        });
        ajv.addSchema({
            $id: "#/abc",
            type: "object",
            properties: {
                name: { $ref: "#/a" },
            },
        });
        const data = { name: "22", age: { name: { name: { name: "111" } } } };

        const validate = ajv.compile(schema);

        validate("ajv result", data);
        console.log("ajv1", validate(data)); // true
        console.log(validate.errors); // true
        console.log(data); // { "foo": 1, "bar": "baz" }
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

        console.log(validate(data)); // true
        console.log(validate.errors); // true
        console.log(data); // { "foo": 1, "bar": "baz" }
    });
    it.only("diff-current", () => {
        function generateRandomString(length) {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let result = "";

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }

            return result;
        }

        const json = {
            $schema: "http://json-schema.org/draft-01/schema#",
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
        for (let i = 0; i < 2; i++) {
            data.names.push(generateRandomString(500000));
        }
        const start = Date.now();
        const context = contextManage.create();
        schemaManage.setMainSchema(context, json);

        console.log("end====================", Date.now() - start);
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
        console.log("end====================", Date.now() - start);
    });
});
