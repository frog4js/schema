import { describe, it } from "node:test";
import * as assert from "assert";
import { errorManage } from "../../src/error/share.js";
import { contextManage } from "../../src/context/share.js";
import { schemaManage } from "../../src/schema/share.js";

describe.only("test the error manage module", () => {
    describe("test the pushError function", () => {
        function setSchema(context) {
            schemaManage.setMainSchema(context, { enum: ["test"] });
            schemaManage.compile(context);
        }
        it("should pass when locale is en-gb and schemaKey is enum", () => {
            const context = contextManage.create();
            setSchema(context);
            context.instanceData.locale = "en-gb";
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(context.errors[0].message, "must be equal to one of the enum values");
        });
        it("should pass when locale is zh-cn and schemaKey is enum", () => {
            const context = contextManage.create();
            setSchema(context);
            context.instanceData.locale = "zh-cn";
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(context.errors[0].message, "必须是指定的枚举值");
        });

        it("should pass when message is custom", () => {
            const context = contextManage.create({
                errorMessages: {
                    enum: {
                        "en-gb": "test",
                    },
                },
            });
            setSchema(context);
            context.instanceData.locale = "zh-cn";
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(context.errors[0].message, "必须是指定的枚举值");
        });
        it("should pass when message is custom and locale is zh-cn", () => {
            const context = contextManage.create({
                errorMessages: {
                    enum: {
                        "zh-cn":
                            "必须是指定的枚举值, schemaPath=${schemaPath},schemaPathLen=${schemaPath.length},error=${currentSchemaValue.a.b},schemaValue=${currentSchemaValue}",
                    },
                },
            });
            context.instanceData.locale = "zh-cn";
            schemaManage.setMainSchema(context, {
                enum: ["a", "b"],
            });
            schemaManage.compile(context);
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(
                context.errors[0].message,
                "必须是指定的枚举值, schemaPath=#/enum,schemaPathLen=6,error=(unknown),schemaValue=a,b",
            );
        });
    });
    describe("test the mergeError function", () => {
        it("should pass merge error", () => {
            const context = contextManage.create();
            errorManage.mergeError(context, [
                {
                    message: "test",
                },
            ]);
            assert.equal(context.errors[0].message, "test");
        });
    });
});
