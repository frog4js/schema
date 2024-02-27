import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { contextManage } from "../../../src/context/share.mjs";
import { schemaManage } from "../../../src/schema/share.mjs";
import { versionConstant } from "../../../src/constants/share.mjs";
import { jsonSchemaVersions } from "../../../src/constants/version.mjs";
describe("test the format module", () => {
    it("should validate and store references correctly for unsupported format", () => {
        const context = contextManage.create();
        try {
            schemaManage.setMainSchema(context, {
                type: "object",
                format: "notFound",
            });
            assert.fail();
        } catch (e) {
            assert.equal(e.name, "SchemaInvalidError");
            assert.equal(e.errors.length, 1);
        }
    });

    it("should validate and store references correctly for URI template format", () => {
        const context = contextManage.create();
        try {
            schemaManage.setMainSchema(context, {
                $schema: versionConstant.jsonSchema$schemaDraftMap[jsonSchemaVersions.draft04],
                type: "string",
                format: "uri-template",
            });
            assert.fail();
        } catch (e) {
            assert.equal(e.name, "SchemaInvalidError");
            assert.equal(e.errors.length, 1);
        }
    });

    it("should validate and store references correctly for email format (draft02)", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            $schema: versionConstant.jsonSchema$schemaDraftMap[jsonSchemaVersions.draft02],
            type: "string",
            format: "email",
        });
    });

    it("should validate and store references correctly for email format (draft04)", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            $schema: versionConstant.jsonSchema$schemaDraftMap[jsonSchemaVersions.draft04],
            type: "string",
            format: "email",
        });
    });
    it("should validate and store references correctly for email format (draft06)", () => {
        const context = contextManage.create();
        schemaManage.setMainSchema(context, {
            $schema: versionConstant.jsonSchema$schemaDraftMap[jsonSchemaVersions.draft06],
            type: "string",
            format: "email",
        });
    });
});
