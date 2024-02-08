/**
 * @typedef {import("../../types/core")}
 */

import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import { executeConstant, typeConstant, versionConstant } from "../constants/share.mjs";

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
function getValueByJsonPointer(obj, pointer) {
    if (pointer === "") {
        return obj; // Return the whole document
    }

    const parts = pointer
        .substring(1)
        .split("/")
        .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
    let current = obj;

    for (let part of parts) {
        current = current[part];
    }

    return current;
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
        if (typeof current?.$ref === typeConstant.typeofTypes.string && current.$ref.startsWith("#")) {
            if (context.version < versionConstant.jsonSchemaVersions.draft04) {
                current = context.refSchemas[current.$ref];
            } else {
                current = getValueByJsonPointer(context.schemaData.origin, current.$ref.substring(1));
            }
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
//
// /**
//  *
//  * @param {Context}context
//  * @return {*}
//  */
//
// function getCurrentSchemaValue(context) {
//     return context.schemaData.current.$ref[context.schemaData.current.key];
// }
//
// /**
//  *
//  * @param {Context}context
//  * @return {*}
//  */
//
// function getCurrentInstanceValue(context) {
//     return context.instanceData.current.$ref[context.instanceData.current.key];
// }
/**
 *
 * @param {Context} context
 * @return { boolean}
 */
function canEqualInstance(context) {
    if (context.version < versionConstant.jsonSchemaVersions.draft03) {
        let siblingSchema;
        if (context.schemaData.current.key === executeConstant.keys.maximum) {
            siblingSchema = getSiblingSchemaRefData(context, executeConstant.keys.maximumCanEqual);
        } else if (context.schemaData.current.key === executeConstant.keys.minimum) {
            siblingSchema = getSiblingSchemaRefData(context, executeConstant.keys.minimumCanEqual);
        }
        if (siblingSchema) {
            return siblingSchema.$ref[siblingSchema.key];
        }
    } else {
        let siblingSchema;
        if (context.schemaData.current.key === executeConstant.keys.maximum) {
            siblingSchema = getSiblingSchemaRefData(context, executeConstant.keys.exclusiveMaximum);
        } else if (context.schemaData.current.key === executeConstant.keys.minimum) {
            siblingSchema = getSiblingSchemaRefData(context, executeConstant.keys.exclusiveMinimum);
        }
        if (siblingSchema) {
            return !siblingSchema.$ref[siblingSchema.key];
        }
    }
    return true;
}
export {
    pushError,
    mergeError,
    setLogError,
    getSiblingSchemaRefData,
    getCurrentSchemaRefData,
    getSiblingInstanceRefData,
    getCurrentInstanceRefData,
    // getCurrentSchemaValue,
    // getCurrentInstanceValue,
    getParentSchema,
    getParentInstance,
    canEqualInstance,
};
