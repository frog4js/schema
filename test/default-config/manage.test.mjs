import { describe, it, beforeEach } from "node:test";
import * as assert from "assert";
import { contextManage } from "../../src/context/share.mjs";
import { vocabularyActuatorConstant, versionConstant } from "../../src/constants/share.mjs";
import { schemaManage } from "../../src/schema/share.mjs";
import { defaultConfigManage } from "../../src/default-config/share.mjs";

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
                baseURI: "http://x.com#",
            });
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
