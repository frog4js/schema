import { beforeEach, describe, it } from "node:test";
import { contextManage } from "../../src/context/share.js";
import { schemaManage } from "../../src/schema/share.js";
import assert from "assert";
import { startSubSchemaExecute } from "../../src/vocabulary-actuator/manage.js";
describe("test the vocabulary actuator manage module", () => {
    describe("test the startSubSchemaExecute function", () => {
        /**
         *
         * @type {Schema}
         */
        let schema;
        beforeEach(() => {
            schema = {
                $schema: "http://json-schema.org/draft-03/schema#",
                type: "object",
                properties: {
                    isStringRef: { $ref: "#/isStringRef" },
                    isRootRef: { $ref: "#" },
                },
                isStringRef: {
                    type: "string",
                },
            };
        });
        it("should execute schema successfully when property is a valid string $ref", () => {
            const context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = {
                isStringRef: "str",
            };
            contextManage.enterContext(context, "properties");
            contextManage.enterContext(context, "isStringRef", "isStringRef");
            const errors = startSubSchemaExecute(context, true);
            assert.equal(errors.length, 0);
        });

        it("should fail to execute schema when property is an invalid string $ref", () => {
            const context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = {
                isStringRef: true,
            };
            contextManage.enterContext(context, "properties");
            contextManage.enterContext(context, "isStringRef", "isStringRef");
            const errors = startSubSchemaExecute(context, true);
            assert.equal(errors.length, 1);
        });

        it("should fail to execute schema when property refers to an existing object that contains an invalid $ref", () => {
            const context = contextManage.create();
            schemaManage.setMainSchema(context, schema);
            schemaManage.compile(context);
            context.instanceData.origin = {
                isRootRef: {
                    isStringRef: 1,
                },
            };
            contextManage.enterContext(context, "properties");
            contextManage.enterContext(context, "isRootRef", "isRootRef");
            const errors = startSubSchemaExecute(context, true);
            assert.equal(errors.length, 1);
        });
    });
});
