import { describe, it, beforeEach } from "node:test";
import Ajv from "ajv";
import addFormats from "ajv-formats";

describe("test the ajv", () => {
    it("ajv1", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });
        addFormats(ajv);

        const schema = {
            type: "object",
            properties: {
                name: { type: ["string", "null"], default: "1" },
            },
            required: ["name"],
        };

        const data = { name: null };

        const validate = ajv.compile(schema);

        console.log(validate(data)); // true
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
});
