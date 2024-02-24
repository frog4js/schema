import { describe, it } from "node:test";
import * as assert from "assert";
import { errorManage } from "../../src/error/share.mjs";
import { contextManage } from "../../src/context/share.mjs";
import { vocabularyActuatorConstant } from "../../src/constants/share.mjs";
import { schemaManage } from "../../src/schema/share.mjs";

describe("test the error manage module", () => {
    describe("test the pushError function", () => {
        it("", () => {
            const context = contextManage.create();
            context.instanceData.locale = "en-gb";
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(context.errors[0].message, "must be equal to one of the enum values");
        });
        it("", () => {
            const context = contextManage.create();
            context.instanceData.locale = "zh-cn";
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(context.errors[0].message, "必须是指定的枚举值");
        });

        it("", () => {
            const context = contextManage.create({
                errorMessages: {
                    enum: {
                        "en-gb": "test",
                    },
                },
            });
            context.instanceData.locale = "zh-cn";
            contextManage.enterContext(context, "enum");
            errorManage.pushError(context);
            assert.equal(context.errors[0].message, "必须是指定的枚举值");
        });
        it("", () => {
            const context = contextManage.create({
                errorMessages: {
                    enum: {
                        "zh-cn":
                            "必须是指定的枚举值, schemaPath=${schemaPath},schemaPathLen=${schemaPath.length},schemaValue=${currentSchemaValue}",
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
                "必须是指定的枚举值, schemaPath=#/enum,schemaPathLen=6,schemaValue=a,b",
            );
        });
    });
});
