import { describe, it, beforeEach } from "node:test";

import * as assert from "assert";
import { versionConstant, vocabularyActuatorConstant } from "../../../src/constants/share.mjs";
import { execResolve } from "./helper.mjs";

describe("test the executes.format module", () => {
    describe("test the resolve function", () => {
        it("should pass when format value is 'date-time'", () => {
            const data = ["2024-01-30T05:24:50.921Z", "1998-12-31T15:59:60.123-08:00", "1963-06-19T08:30:06.283185Z"];
            for (let item of data) {
                const context = execResolve(
                    {
                        type: "string",
                        format: "date-time",
                    },
                    item,
                    vocabularyActuatorConstant.keys.format,
                    0,
                    0,
                    [vocabularyActuatorConstant.keys.format],
                    undefined,
                );
                assert.equal(context.errors.length, 0);
            }
        });

        it("should fail when format value is 'date-time'", () => {
            const data = ["1998-12-31T23:59:61Z", "2024-01-30T05:24:50.921"];
            for (let item of data) {
                const context = execResolve(
                    {
                        type: "string",
                        format: "date-time",
                    },
                    "2024-01-30T05:24:50.921",
                    vocabularyActuatorConstant.keys.format,
                    0,
                    0,
                    [vocabularyActuatorConstant.keys.format],
                    undefined,
                );
                assert.equal(context.errors.length, 1);
                assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
            }
        });

        it("should pass when format value is 'date'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "date",
                },
                "2024-01-30",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'time'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "time",
                },
                "11:00",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'utc-millisec'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "utc-millisec",
                },
                "112",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'regex'", () => {
            const context = execResolve(
                {
                    $schema: versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersions.draft03],
                    type: "string",
                    format: "regex",
                },
                "112",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should fail when format value is 'regex'", () => {
            const context = execResolve(
                {
                    $schema: versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersions.draft03],
                    type: "string",
                    format: "regex",
                },
                "[",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'color'", () => {
            const context = execResolve(
                {
                    $schema: versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersions.draft02],
                    type: "string",
                    format: "color",
                },
                "#FFF",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 0);
        });

        it("should pass when format value is 'style'", () => {
            const context = execResolve(
                {
                    $schema: versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersions.draft01],
                    type: "string",
                    format: "style",
                },
                "color: red; background-color:#FFF",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'uri'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "uri",
                },
                "https://www.example.com/path/to/resource?param1=value1&param2=value2",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'uri'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "email",
                },
                "123@163.com",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'ipv4'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "ipv4",
                },
                "127.0.0.1",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });

        it("should pass when format value is 'ipv6'", () => {
            const context = execResolve(
                {
                    type: "string",
                    format: "ipv6",
                },
                "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
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
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });
        it("should fail when format value is 'json-schema-system-base-URI'", () => {
            const context = execResolve(
                {
                    $schema: "http://json-schema.org/draft-03/schema#",
                    type: "string",
                    format: "json-schema-system-base-URI",
                },
                "error/",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );

            const context1 = execResolve(
                {
                    $schema: "http://json-schema.org/draft-06/schema#",
                    type: "string",
                    format: "json-schema-system-base-URI",
                },
                "http://xxx.com/a",
                vocabularyActuatorConstant.keys.format,
                0,
                0,
                [vocabularyActuatorConstant.keys.format],
                undefined,
            );
            assert.equal(context.errors.length, 1);
            assert.equal(context.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);

            assert.equal(context1.errors.length, 1);
            assert.equal(context1.errors[0].currentSchemaKey, vocabularyActuatorConstant.keys.format);
        });
    });
});
