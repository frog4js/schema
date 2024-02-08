/**
 * @typedef {import("../../types/share").JSONSchema.Context} Context
 * @typedef {import("../../types/share").JSONSchema.VocabularyActuatorConfig} VocabularyActuatorConfig
 * @typedef {import("../../types/share").JSONSchema.Schema} Schema
 * @typedef {import("../../types/share").JSONSchema.ExecuteError} ExecuteError
 */

import { getJsonTypeByRefData, getTypeofTypeByRefData } from "../util/type.mjs";
import { executeConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import coreConfigs from "./core/share.mjs";
import { contextManage } from "../context/share.mjs";
import referenceConfigs from "./reference/share.mjs";
import { typeUtil } from "../util/share.mjs";
import validationConfigs from "./validation/share.mjs";
import { errorManage } from "../error/share.mjs";

/**
 *
 * @param {Context} context
 * @param {*}instance
 */
function validate(context, instance) {
    if (!context.schemaData.origin) {
        throw new Error("TODO");
    }
    context.instanceData.origin = instance;
    context.instanceData.current = { $ref: { root: instance }, key: "root" };
    context.instancePaths = [];
    context.errors = [];
    context.tempErrors = [];
    context.errorState = {
        isTemp: false,
        lockKey: "",
    };
    startValidate(context);
    return context;
}
/**
 *
 * @param {Context} context
 * @param {boolean} [isPushError]
 * @return {ExecuteError[]}
 */
function startRefOrSchemaExecute(context, isPushError) {
    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
    errorManage.setLogError(context, true);
    if (typeof schemaValue.$ref === typeConstant.typeofTypes.string) {
        if (schemaValue.$ref.startsWith("#") && context.refSchemas[schemaValue.$ref]) {
            contextManage.enterContext(context, executeConstant.pathKeys.ref);
            contextManage.enterContext(context, schemaValue.$ref);
            startValidateValidation(context);
            contextManage.backContext(context, schemaValue.$ref);
            contextManage.backContext(context, executeConstant.pathKeys.ref);
        } else {
            // TODO
        }
    } else {
        startValidateValidation(context);
    }
    if (errorManage.setLogError(context, false)) {
        const errors = context.tempErrors;
        context.tempErrors = [];
        if (isPushError === true) {
            errorManage.mergeError(context, errors);
        }
        return errors;
    } else {
        return [];
    }
}

/**
 *
 * @param {Context} context
 */
function startValidateValidation(context) {
    executeLoop: for (let execute of validationConfigs) {
        if (!execute.versions.includes(context.version)) {
            continue;
        }
        contextManage.enterContext(context, execute.key);
        for (const match of execute.matches) {
            const schemaType = typeUtil.getJsonTypeByRefData(context.schemaData.current);
            const instanceType = typeUtil.getTypeofTypeByRefData(context.instanceData.current);
            let isExec = true;
            if (isExec && (!match.schemaTypes || match.schemaTypes.includes(schemaType))) {
                isExec = true;
            } else {
                isExec = false;
            }
            if (isExec && (!match.instanceTypes || match.instanceTypes.includes(instanceType))) {
                isExec = true;
            } else {
                isExec = false;
            }

            if (isExec) {
                const tick = match.resolve(context, {
                    startRefOrSchemaExecute,
                });
                if (tick === executeConstant.ticks.nextExecute) {
                    break;
                } else if (tick === executeConstant.ticks.endExecute) {
                    contextManage.backContext(context, execute.key);
                    break executeLoop;
                }
            }
        }
        contextManage.backContext(context, execute.key);
    }
    context.endTime = Date.now();
}
/**
 *
 * @param {Context} context
 */
function startValidateCore(context) {
    executeLoop: for (let execute of coreConfigs) {
        if (!execute.versions.includes(context.version)) {
            continue;
        }
        enterContext(context, undefined, execute.key);
        for (const match of execute.matches) {
            const instanceType = getTypeofTypeByRefData(context.instanceData.current);
            let isExec = true;
            if (isExec && (!match.instanceTypes || match.instanceTypes.includes(instanceType))) {
                isExec = true;
            } else {
                isExec = false;
            }
            if (isExec) {
                const tick = match.resolve(context, {
                    startRefOrSchemaExecute,
                });
                if (tick === executeConstant.ticks.nextExecute) {
                    break;
                } else if (tick === executeConstant.ticks.endExecute) {
                    contextManage.backContext(context, execute.key);
                    break executeLoop;
                }
            }
        }
        contextManage.backContext(context, undefined, execute.key);
    }
    context.endTime = Date.now();
}
/**
 *
 * @param {Context} context
 */
function startValidate(context) {
    startValidateCore(context);
    startValidateValidation(context);
}
export { validate };
