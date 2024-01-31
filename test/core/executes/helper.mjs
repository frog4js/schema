/**
 * @typedef {import("../../../types/core")}
 */

import {
    backContext,
    createContext,
    enterContext,
    startRefOrSchemaExecute,
    startChildExecute,
    startExecute,
} from "../../../src/core/engine.mjs";
import { executeConfigs } from "../../../src/core/executes/share.mjs";
import * as assert from "assert";

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
) {
    const context = createContext(schema, instance, configs);
    if (schemaKeys) {
        schemaKeys.forEach((key) => enterContext(context, key));
    }

    if (instanceKeys) {
        instanceKeys.forEach((key) => enterContext(context, undefined, key));
    }
    const filterExecuteConfigs = executeConfigs.filter((x) => x.key === executeKey);
    const result = filterExecuteConfigs[versionIndex].matches[matchIndex].resolve(context, {
        startRefOrSchemaExecute,
        startChildExecute,
        enterContext,
        backContext,
        startExecute,
    });
    if (expectResult) {
        assert.equal(result, expectResult);
    }
    if (schemaKeys) {
        schemaKeys.forEach((key) => backContext(context, key));
    }

    if (instanceKeys) {
        instanceKeys.forEach((key) => backContext(context, undefined, key));
    }
    return context;
}
