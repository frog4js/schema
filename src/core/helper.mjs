/**
 * @typedef {import("../../types/core")}
 */

import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import { executeConstant, typeConstant } from "../constants/share.mjs";

/**
 *
 * @param {RefData} refData
 */
function slowGetRefDataDecodeAndDeepCloe(refData) {
    let isObject = false;
    typeUtil.dispatchPlatformTypeByRefData(refData, [
        {
            type: typeConstant.platformType.ParentObject,
            callback: () => {
                isObject = true;
            },
        },
    ]);
    return isObject ? dataOperateUtil.deepClone(refData.$ref?.[refData.key]) : refData.$ref?.[refData.key];
}
/**
 *
 * @param {Context} context
 * @param {string} code
 */
function pushError(context, code) {
    (context.errorState.isTemp ? context.tempErrors : context.errors).push({
        instancePath: context.instancePaths.length > 0 ? "/" + context.instancePaths.join("/") : "",
        schemaPath:
            context.schemaPaths.length > 0
                ? "#/" + context.schemaPaths.filter((x) => x !== executeConstant.pathKeys.ref).join("/")
                : "#",
        currentSchemaKey: context.schemaData.current.key,
        currentSchemaValue: slowGetRefDataDecodeAndDeepCloe(context.schemaData.current),
        currentInstanceKey: context.instanceData.current.key,
        currentInstanceValue: slowGetRefDataDecodeAndDeepCloe(context.instanceData.current),
        message: executeConstant.errorCodes[code],
        code: code,
    });
}

/**
 *
 * @param {Context} context
 * @param {boolean} isTempError
 */
function setLogError(context, isTempError) {
    if (isTempError === true && context.errorState.isTemp === false) {
        context.errorState.isTemp = true;
        context.errorState.lockKey = context.schemaPaths.join("/");
        return true;
    } else if (
        isTempError === false &&
        context.errorState.isTemp === true &&
        context.schemaPaths.join("/") === context.errorState.lockKey
    ) {
        context.errorState.isTemp = false;
        context.errorState.lockKey = "";
        return true;
    }
    return false;
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
 * @return {RefData}
 */
function getCurrentInstanceRefData(context) {
    if (context.instancePaths.length === 0) {
        return {
            $ref: { root: context.instanceData.origin },
            key: "root",
        };
    }
    const current = getParentInstance(context);
    return { $ref: current, key: context.instancePaths[context.instancePaths.length - 1] };
}

/**
 *
 * @param {Context} context
 * @return {RefData}
 */
function getCurrentSchemaRefData(context) {
    if (context.schemaPaths.length === 0) {
        return {
            $ref: { root: context.schemaData.origin },
            key: "root",
        };
    }
    const current = getParentSchema(context);
    return { $ref: current, key: context.schemaPaths[context.schemaPaths.length - 1] };
}

/**
 *
 * @param {Context}context
 * @param {string} key
 * @return {RefData}
 */
function getSiblingInstanceRefData(context, key) {
    if (context.instancePaths.length === 0) {
        return {
            $ref: { root: context.instanceData.origin },
            key: "root",
        };
    }
    const current = getParentInstance(context);
    return { $ref: current, key };
}

/**
 *
 * @param {Context}context
 * @param {string} key
 * @return {RefData}
 */
function getSiblingSchemaRefData(context, key) {
    if (context.schemaPaths.length === 0) {
        return {
            $ref: { root: context.schemaData.origin },
            key: "root",
        };
    }
    const current = getParentSchema(context);
    return { $ref: current, key };
}

function getParentSchema(context) {
    let current = context.schemaData.origin;
    for (let i = 0; i < context.schemaPaths.length - 1; i++) {
        const keyOrIndex = context.schemaPaths[i];
        if (keyOrIndex === executeConstant.pathKeys.ref) {
            current = context.refSchemas;
        } else {
            current = current[keyOrIndex];
        }
        if (
            typeof current?.$ref === typeConstant.typeofTypes.string &&
            current.$ref.startsWith("#") &&
            context.refSchemas[current.$ref]
        ) {
            current = context.refSchemas[current.$ref];
        }
    }
    return current;
}
function getParentInstance(context) {
    let current = context.instanceData.origin;
    for (let i = 0; i < context.instancePaths.length - 1; i++) {
        const keyOrIndex = context.instancePaths[i];
        current = current[keyOrIndex];
    }
    return current;
}

/**
 *
 * @param {Context}context
 * @return {*}
 */

function getCurrentSchemaValue(context) {
    return context.schemaData.current.$ref[context.schemaData.current.key];
}

/**
 *
 * @param {Context}context
 * @return {*}
 */

function getCurrentInstanceValue(context) {
    return context.instanceData.current.$ref[context.instanceData.current.key];
}

export {
    pushError,
    mergeError,
    setLogError,
    getSiblingSchemaRefData,
    getCurrentSchemaRefData,
    getSiblingInstanceRefData,
    getCurrentInstanceRefData,
    getCurrentSchemaValue,
    getCurrentInstanceValue,
    getParentSchema,
    getParentInstance,
};
