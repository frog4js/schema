import { describe, it, beforeEach } from "node:test";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { schemaManage, instanceManage } from "../../src/api/share.mjs";

describe("test the ajv", () => {
    it("ajv1", () => {
        const ajv = new Ajv({ useDefaults: true, allErrors: true });
        addFormats(ajv);

        const schema = {
            type: "object",
            properties: {
                val: { type: "array", uniqueItems: true },
            },
        };

        const data = {
            val: [
                { b: 1, a: 2 },
                { a: 2, b: 1 },
            ],
        };

        const validate = ajv.compile(schema);
        validate(data);
        console.log("ajv1", validate(data)); // true
        console.log(validate.errors); // true
        console.log(data); // { "foo": 1, "bar": "baz" }
    });

    function validate10(data, { instancePath = "", parentData, parentDataProperty, rootData = data } = {}) {
        let vErrors = null;
        let errors = 0;
        if (data && typeof data == "object" && !Array.isArray(data)) {
            if (data.val !== undefined) {
                let data0 = data.val;
                if (Array.isArray(data0)) {
                    let i0 = data0.length;
                    let j0;
                    if (i0 > 1) {
                        outer0: for (; i0--; ) {
                            for (j0 = i0; j0--; ) {
                                if (func0(data0[i0], data0[j0])) {
                                    const err0 = {
                                        instancePath: instancePath + "/val",
                                        schemaPath: "#/properties/val/uniqueItems",
                                        keyword: "uniqueItems",
                                        params: { i: i0, j: j0 },
                                        message:
                                            "must NOT have duplicate items (items ## " +
                                            j0 +
                                            " and " +
                                            i0 +
                                            " are identical)",
                                    };
                                    if (vErrors === null) {
                                        vErrors = [err0];
                                    } else {
                                        vErrors.push(err0);
                                    }
                                    errors++;
                                    break outer0;
                                }
                            }
                        }
                    }
                } else {
                    const err1 = {
                        instancePath: instancePath + "/val",
                        schemaPath: "#/properties/val/type",
                        keyword: "type",
                        params: { type: "array" },
                        message: "must be array",
                    };
                    if (vErrors === null) {
                        vErrors = [err1];
                    } else {
                        vErrors.push(err1);
                    }
                    errors++;
                }
            }
        } else {
            const err2 = {
                instancePath,
                schemaPath: "#/type",
                keyword: "type",
                params: { type: "object" },
                message: "must be object",
            };
            if (vErrors === null) {
                vErrors = [err2];
            } else {
                vErrors.push(err2);
            }
            errors++;
        }
        validate10.errors = vErrors;
        return errors === 0;
    }

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
    it("diff-current", () => {
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

        const schema = schemaManage.create(json);
        instanceManage.validate(schema, data);

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
