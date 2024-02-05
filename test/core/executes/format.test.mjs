import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { executeConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.format module", () => {
    describe("test the resolve function", () => {
        it("should pass when format value is 'error-format'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "error-format",
                },
                "",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when format value is 'date-time'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "date-time",
                },
                "2024-01-30T05:24:50.921Z",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'date-time'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "date-time",
                },
                "2024-01-30T05:24:50.921",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'date'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "date",
                },
                "2024-01-30",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'date'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "date",
                },
                "2024-01-302",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'time'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "time",
                },
                "11:00",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'date'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "time",
                },
                "33:00",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'utc-millisec'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "utc-millisec",
                },
                "112",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'date'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "utc-millisec",
                },
                "-1",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'regex'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "regex",
                },
                "112",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'regex'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "regex",
                },
                "[",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'color'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "color",
                },
                "#FFF",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when format value is 'style'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "style",
                },
                "color: red; background-color:#FFF",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when format value is 'phone'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "phone",
                },
                "+86 12333333333",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'phone'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "phone",
                },
                "12333333333",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'uri'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "uri",
                },
                "https://www.example.com/path/to/resource?param1=value1&param2=value2",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'uri'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "uri",
                },
                "/a/b",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'uri'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "email",
                },
                "123@163.com",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'uri'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "email",
                },
                "123@",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'ipv4'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "ipv4",
                },
                "127.0.0.1",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'ipv4'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "ipv4",
                },
                "123.0.0.266",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });

        it("should pass when format value is 'ipv6'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "ipv6",
                },
                "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'ipv6'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "ipv6",
                },
                "123.0.0.0",
                executeConstant.keys.format,
                0,
                0,
                [executeConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].code, "formatMustMatchTheDefinitionOfFormat");
        });
    });
});
