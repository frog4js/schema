import { describe, it } from "node:test";
import * as assert from "assert";
import { setLogError, pushError, mergeError } from "../../src/error/manage.mjs";
import { contextManage } from "../../src/context/share.mjs";

describe.only("test the error manage module", () => {
    describe("test the setLogError function", () => {
        it("should set errorState.isTemp to true and update lockKey if isTempError is true and errorState.isTemp is false", () => {
            const context = contextManage.create();
            context.errorState = { isTemp: false, lockKey: "" };
            context.schemaPaths = ["path1", "path2"];
            const isTempError = true;
            setLogError(context, isTempError);
            assert.strictEqual(context.errorState.isTemp, true, "errorState.isTemp should be true");
            assert.strictEqual(context.errorState.lockKey, "path1/path2", "errorState.lockKey should be 'path1/path2'");
        });

        it("should set errorState.isTemp to false and clear lockKey if isTempError is false, errorState.isTemp is true, and lockKey matches schemaPaths", () => {
            const context = contextManage.create();
            context.errorState = { isTemp: true, lockKey: "path1/path2" };
            context.schemaPaths = ["path1", "path2"];
            const isTempError = false;

            setLogError(context, isTempError);
            assert.strictEqual(context.errorState.isTemp, false, "errorState.isTemp should be false");
            assert.strictEqual(context.errorState.lockKey, "", "errorState.lockKey should be ''");
        });

        it("should return false if isTempError is true and errorState.isTemp is true", () => {
            const context = contextManage.create();
            context.errorState = { isTemp: true, lockKey: "path1/path2" };
            context.schemaPaths = ["path1", "path2"];
            const isTempError = true;

            assert.strictEqual(setLogError(context, isTempError), false, "The function should return false");
        });

        it("should return false if isTempError is false, errorState.isTemp is false, and lockKey does not match schemaPaths", () => {
            const context = contextManage.create();
            context.errorState = { isTemp: false, lockKey: "path1/path3" };
            const isTempError = false;

            assert.strictEqual(setLogError(context, isTempError), false, "The function should return false");
        });
    });
});
