/**
 * @typedef {import("../../types/share")}
 */

import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import coreConfigs from "./core/share.mjs";
import { contextManage } from "../context/share.mjs";
import specialConfigs from "./special/share.mjs";
import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import validationConfigs from "./validation/share.mjs";
import { errorClass, errorManage } from "../error/share.mjs";

/**
 *
 * @param {Context} context
 * @param {*}instance
 * @param {string} [locale]
 * @return {{errors: Array<ExecuteError>, valid: boolean}}
 */
function validate(context, instance, locale) {
    if (!context.schemaData.origin) {
        return { valid: false, errors: [{ message: "instance is null" }] };
    }
    context.phase = contextConstant.phases.instanceValidate;
    context.instanceData.origin = instance;
    context.instanceData.locale = locale || context.defaultConfig.locale;
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
 * @return {ExecuteError[] | boolean}
 */
function startSubSchemaExecute(context, isTryExecute) {
    isTryExecute === true && contextManage.lock(context);
    const errorCount = context.errors.length;
    startValidateValidation(context);
    if (isTryExecute) {
        return contextManage.unlock(context).errors;
    } else if (context.errors.length > errorCount) {
        return true;
    } else {
        return false;
    }
}

/**
 *
 * @param {Context} context
 * @return {ExecuteError[] | boolean}
 */
function startRefExecute(context) {
    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
    const paths = [vocabularyActuatorConstant.pathKeys.ref, schemaValue];
    paths.forEach((pathItem) => contextManage.enterContext(context, pathItem));
    startValidateValidation(context);
    paths.forEach((pathItem) => contextManage.backContext(context, pathItem));
}

/**
 *
 * @param {Context} context
 */
function startValidateValidation(context) {
    if (context.schemaData.current?.$ref?.[context.schemaData.current.key] === true) {
        return;
    } else if (context.schemaData.current?.$ref?.[context.schemaData.current.key] === false) {
        errorManage.pushError(context, vocabularyActuatorConstant.errorMessageKeys.schemaIsFalse);
        return;
    } else if (typeUtil.getTypeofTypeByRefData(context.schemaData.current) !== typeConstant.typeofTypes.object) {
        return;
    }
    if (
        context.phase === contextConstant.phases.schemaValidate &&
        typeUtil.getTypeofType(context.instanceData.current.$ref?.[context.instanceData.current.key]) ===
            typeConstant.typeofTypes.object &&
        context.schemaData.current.$ref === context.referenceSchemas
    ) {
        Object.defineProperty(
            context.instanceData.current.$ref[context.instanceData.current.key],
            vocabularyActuatorConstant.flags.isSchema,
            {
                value: true,
                enumerable: false,
            },
        );
    }
    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
    executeLoop: for (let execute of validationConfigs) {
        if (!(execute.key in schemaValue)) {
            continue;
        }
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
                    startSubSchemaExecute,
                    startRefExecute,
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
                    startSubSchemaExecute,
                    startRefExecute,
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
            const isSchemaInItem = item[vocabularyActuatorConstant.flags.isSchema];
            if (isSchemaInItem) {
                specialConfigs.forEach((config) => {
                    if (config.versions.includes(context.version) && config.key in item) {
                        config.matches.forEach((match) => {
                            if (
                                !match.instanceTypes ||
                                match.instanceTypes.includes(typeUtil.getTypeofType(item[config.key]))
                            ) {
                                contextManage.enterContext(context, undefined, config.key);
                                match.resolve(context);
                                contextManage.backContext(context, undefined, config.key);
                            }
                        });
                    }
                });
            }
            for (const key of Object.keys(item)) {
                contextManage.enterContext(context, undefined, key);
                each(key, item[key]);
                contextManage.backContext(context, undefined, key);
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
    context.locks = [];
    context.errors = [];
    context.caches = [];
    if (context.phase === contextConstant.phases.instanceValidate) {
        if (context.state !== contextConstant.states.compile) {
            throw new errorClass.SystemError("state is init");
        }
    } else if (context.phase === contextConstant.phases.schemaValidate) {
        startValidateCore(context);
    }
    restoreStartState(context);
    startValidateValidation(context);
    if (context.phase === contextConstant.phases.schemaValidate) {
        startValidateSchemaSpecialValue(context);
    }
}

/**
 *
 * @param {Context}context
 */
function restoreStartState(context) {
    context.instanceData.current = { $ref: { root: context.instanceData.origin }, key: "root" };
    context.instancePaths = [];
    context.locks = [];
}

export { validate, startValidate, startSubSchemaExecute };
