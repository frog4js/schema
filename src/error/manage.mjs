import { vocabularyActuatorConstant, typeConstant } from "../constants/share.mjs";
import { dataOperateUtil, typeUtil } from "../util/share.mjs";
/**
 * @typedef {import("../../types/share")}
 */
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
 * @param {string} code
 */
function pushError(context, code) {
    (context.errorState.isTemp ? context.tempErrors : context.errors).push({
        instancePath: context.instancePaths.length > 0 ? "/" + context.instancePaths.join("/") : "",
        schemaPath: context.schemaPaths.filter((x) => x !== vocabularyActuatorConstant.pathKeys.ref).join("/"),
        currentSchemaKey: context.schemaData.current.key,
        currentSchemaValue: slowGetRefDataDecodeAndDeepCloe(context.schemaData.current),
        currentInstanceKey: context.instanceData.current.key,
        currentInstanceValue: slowGetRefDataDecodeAndDeepCloe(context.instanceData.current),
        message: vocabularyActuatorConstant.errorCodes[code],
        code: code,
    });
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
export { pushError, mergeError, setLogError };
