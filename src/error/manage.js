import { vocabularyActuatorConstant, typeConstant } from "../constants/share.js";
import { dataOperateUtil, typeUtil } from "../util/share.js";
/**
 * @typedef {import("../../types/share")}
 */

/**
 *
 * @param {string} str
 * @param {Record<string, *>}variables
 * @return {*}
 */
function replaceTemplateString(str, variables) {
    return str.replace(/\$\{(.*?)\}/g, (match, key) => {
        let value = variables;
        try {
            for (let item of key.split(".")) {
                value = value[item];
            }
        } catch (e) {
            value = "(unknown)";
        }
        return value;
    });
}

/**
 *
 * @param {Context} context
 * @param {ExecuteError[]} errors
 */
function mergeError(context, errors) {
    for (const error of errors) {
        context.errors.push({
            ...error,
        });
    }
}

/**
 *
 * @param {Context} context
 * @param {string} [errorMessageKey]
 */
function pushError(context, errorMessageKey) {
    const error = {
        instancePath: context.instancePaths.length > 0 ? "/" + context.instancePaths.join("/") : "",
        schemaPath: context.schemaPaths.filter((x) => x !== vocabularyActuatorConstant.pathKeys.ref).join("/"),
        currentSchemaKey: context.schemaData.current.key,
        currentSchemaValue: slowGetRefDataDecodeAndDeepCloe(context.schemaData.current),
        currentInstanceKey: context.instanceData.current.key,
        currentInstanceValue: slowGetRefDataDecodeAndDeepCloe(context.instanceData.current),
        message: null,
    };
    const messageStr =
        context.defaultConfig.errorMessages?.[errorMessageKey || context.schemaData.current.key]?.[
            context.instanceData.locale
        ];
    if (messageStr) {
        error.message = replaceTemplateString(messageStr, error);
    }
    if (context.locks.length) {
        context.locks[context.locks.length - 1].errors.push(error);
    } else {
        context.errors.push(error);
    }
}

/**
 *
 * @param {RefData} refData
 */
function slowGetRefDataDecodeAndDeepCloe(refData) {
    let isObject = false;
    typeUtil.dispatchPlatformTypeByRefData(refData, [
        {
            type: typeConstant.platformTypeGroups.parentObject,
            callback: () => {
                isObject = true;
            },
        },
    ]);
    return isObject ? dataOperateUtil.deepClone(refData.$ref?.[refData.key]) : refData.$ref?.[refData.key];
}

export { pushError, mergeError };
