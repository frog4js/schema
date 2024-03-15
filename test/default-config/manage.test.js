import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { defaultConfigManage } from "../../src/default-config/share.js";

/**
 * @typedef {import("../types/share")}
 */
describe("test the default-config manage module", () => {
    describe("test the validate function", () => {
        it("should fail when property key is not found", () => {
            assert.throws(
                () => {
                    defaultConfigManage.validate({
                        notfound: "error",
                    });
                },
                {
                    name: "DefaultConfigError",
                },
            );
        });
        it("should pass when config is valid", () => {
            defaultConfigManage.validate({
                $schema: "http://json-schema.org/draft-01/schema#",
                baseURI: "http://x.com/",
                locale: "zh-cn",
                errorMessages: {
                    enum: {
                        "zh-cn": "必须是指定的枚举值1",
                        "en-gb": "must be equal to one of the enum values",
                    },
                },
            });
        });
        it("should fail when property errorMessages is error data", () => {
            assert.throws(
                () => {
                    defaultConfigManage.validate({
                        errorMessages: {
                            error1: 1,
                            enum: {
                                "zh-cn": 1,
                                "en-gb": "must be equal to one of the enum values",
                            },
                        },
                    });
                },
                {
                    name: "DefaultConfigError",
                },
            );
        });
    });
    describe("test the getSystemDefaultConfig function", () => {
        it("should return the correct default config", () => {
            const config = defaultConfigManage.getSystemDefaultConfig();
            assert.ok(config.baseURI);
            assert.ok(config.$schema);
        });
    });
});
