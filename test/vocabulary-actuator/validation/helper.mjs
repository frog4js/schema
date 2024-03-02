/**
 * @typedef {import("../../../types/core")}
 */

import { startSubSchemaExecute } from "../../../src/vocabulary-actuator/manage.mjs";
import { contextManage } from "../../../src/context/share.mjs";
import * as assert from "assert";
import { schemaManage } from "../../../src/schema/share.mjs";
import validationConfigs from "../../../src/vocabulary-actuator/validation/share.mjs";
/**
 *
 * @param {Schema} schema
 * @param {*} instance
 * @param {string} executeKey
 * @param {number} versionIndex
 * @param {number} matchIndex
 * @param {Array<string>} [schemaKeys]
 * @param {Array<string>} [instanceKeys]
 * @param {*} [configs]
 * @param {number} [expectResult]
 * @param {Array<{paths: [], data: Record<string, *>}>} [caches]
 */
export function execResolve(
    schema,
    instance,
    executeKey,
    versionIndex,
    matchIndex,
    schemaKeys,
    instanceKeys,
    configs,
    expectResult,
    caches,
) {
    const context = contextManage.create();
    if (configs?.phase) {
        context.phase = configs.phase;
    }

    schemaManage.setMainSchema(context, schema);
    schemaManage.compile(context);
    context.instanceData.origin = instance;
    if (schemaKeys) {
        schemaKeys.forEach((key) => contextManage.enterContext(context, key));
    }

    if (instanceKeys) {
        instanceKeys.forEach((key) => contextManage.enterContext(context, undefined, key));
    }
    const filterExecuteConfigs = validationConfigs.filter((x) => x.key === executeKey);
    if (caches) {
        context.caches = caches;
    }
    const result = filterExecuteConfigs[versionIndex].matches[matchIndex].resolve(context, {
        startSubSchemaExecute,
    });
    if (expectResult) {
        assert.equal(result, expectResult);
    }
    if (schemaKeys) {
        schemaKeys.forEach((key) => contextManage.backContext(context, key));
    }

    if (instanceKeys) {
        instanceKeys.forEach((key) => contextManage.backContext(context, undefined, key));
    }
    return context;
}
