/**
 * @typedef {import("../../types/share")}

 */

import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import coreConfigs from "./core/share.mjs";
import { contextManage } from "../context/share.mjs";
import referenceConfigs from "./reference/share.mjs";
import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import validationConfigs from "./validation/share.mjs";
import { errorManage } from "../error/share.mjs";

/**
 *
 * @param {Context} context
 * @param {*}instance
 * @return {{errors: Array<ExecuteError>, valid: boolean}}
 */
function validate(context, instance) {
    if (!context.schemaData.origin) {
        throw new Error("TODO");
    }
    context.phase = contextConstant.phases.instanceValidate;
    context.instanceData.origin = instance;
    startValidate(context);
    return {
        valid: !(context.errors.length > 0),
        errors: context.errors,
    };
}
/**
 *
 * @param {Context} context
 * @param {boolean} [isTryExecute]
 * @return {ExecuteError[]}
 */
function startRefOrSchemaExecute(context, isTryExecute) {
    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
    isTryExecute === true && errorManage.setLogError(context, true);
    if (typeof schemaValue.$ref === typeConstant.typeofTypes.string) {
        const paths = dataOperateUtil.getPathsByRef(schemaValue);
        paths.unshift(vocabularyActuatorConstant.pathKeys.ref);
        paths.forEach((pathItem) => contextManage.enterContext(context, pathItem));
        startValidateValidation(context);
        paths.forEach((pathItem) => contextManage.backContext(context, pathItem));
    } else {
        startValidateValidation(context);
    }
    if (isTryExecute && errorManage.setLogError(context, false)) {
        const errors = context.tempErrors;
        context.tempErrors = [];
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
                if (tick === vocabularyActuatorConstant.ticks.nextExecute) {
                    break;
                } else if (tick === vocabularyActuatorConstant.ticks.endExecute) {
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
    restoreStartState(context);
    executeLoop: for (let execute of coreConfigs) {
        if (!execute.versions.includes(context.version)) {
            continue;
        }
        contextManage.enterContext(context, undefined, execute.key);
        for (const match of execute.matches) {
            const instanceType = typeUtil.getTypeofTypeByRefData(context.instanceData.current);
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
                if (tick === vocabularyActuatorConstant.ticks.nextExecute) {
                    break;
                } else if (tick === vocabularyActuatorConstant.ticks.endExecute) {
                    contextManage.backContext(context, execute.key);
                    break executeLoop;
                }
            }
        }
        contextManage.backContext(context, undefined, execute.key);
    }
    context.endTime = Date.now();
}

function startValidateSchemaSpecialValue(context) {
    restoreStartState(context);

    const each = (keyOrIndex, item) => {
        const itemType = typeUtil.getTypeofType(item);
        if (itemType === typeConstant.typeofTypes.array) {
            item.map((subItem, index) => {
                contextManage.enterContext(context, undefined, index);
                each(index, subItem);
                contextManage.backContext(context, undefined, index);
            });
        } else if (itemType === typeConstant.typeofTypes.object) {
            for (const key of Object.keys(item)) {
                contextManage.enterContext(context, undefined, key);
                each(key, item[key]);
                contextManage.backContext(context, undefined, key);
            }
        } else {
            if (typeof keyOrIndex === typeConstant.typeofTypes.string) {
                referenceConfigs.forEach((config) => {
                    if (config.versions.includes(context.version) && keyOrIndex === config.key) {
                        config.matches.forEach((match) => {
                            if (!match.instanceTypes || match.instanceTypes.includes(itemType)) {
                                match.resolve(context);
                            }
                        });
                    }
                });
            }
        }
    };
    return each(undefined, context.instanceData.origin);
}

/**
 *
 * @param {Context} context
 */
function startValidate(context) {
    if (context.phase === contextConstant.phases.instanceValidate) {
        if (context.state !== contextConstant.states.compile) {
            throw new Error("TODO2");
        }
    } else if (context.phase === contextConstant.phases.schemaValidate) {
        startValidateCore(context);
        startValidateSchemaSpecialValue(context);
    }
    restoreStartState(context);
    startValidateValidation(context);
}

/**
 *
 * @param {Context}context
 */
function restoreStartState(context) {
    context.instanceData.current = { $ref: { root: context.instanceData.origin }, key: "root" };
    context.instancePaths = [];
    context.errors = [];
    context.tempErrors = [];
    context.errorState = {
        isTemp: false,
        lockKey: "",
    };
}
export { validate, startValidate, startRefOrSchemaExecute };
