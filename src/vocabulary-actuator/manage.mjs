/**
 * @typedef {import("../../types/share").JSONSchema.Context} Context
 * @typedef {import("../../types/share").JSONSchema.VocabularyActuatorConfig} VocabularyActuatorConfig
 * @typedef {import("../../types/share").JSONSchema.Schema} Schema
 * @typedef {import("../../types/share").JSONSchema.ExecuteError} ExecuteError
 */

import { getJsonTypeByRefData, getTypeofTypeByRefData } from "../util/type.mjs";
import { executeConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import coreConfigs from "./core/share.mjs";

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
/**
 *
 * @param {Context} context
 * @param {string | number } [schemaKey]
 * @param {string | number} [instanceKey]
 */
function enterContext(context, schemaKey, instanceKey) {
    {
        if (instanceKey !== undefined) {
            context.instancePaths.push(instanceKey);
        }
        if (schemaKey !== executeConstant.pathKeys.ref) {
            context.instanceData.current = getCurrentInstanceRefData(context);
        }
    }
    {
        if (schemaKey !== undefined) {
            context.schemaPaths.push(schemaKey);
        }
        if (schemaKey !== executeConstant.pathKeys.ref) {
            context.schemaData.current = getCurrentSchemaRefData(context);
        }
    }
}

function backContext(context, schemaKey, instanceKey) {
    if (instanceKey !== undefined) {
        context.instancePaths.pop();
        context.instanceData.current = getCurrentInstanceRefData(context);
    }
    if (schemaKey !== undefined) {
        context.schemaPaths.pop();
        context.schemaData.current = getCurrentSchemaRefData(context);
    }
}

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
 * @param {VocabularyActuatorConfig} actuatorConfigs
 */
function validateEngine(context, actuatorConfigs) {
    executeLoop: for (let execute of actuatorConfigs) {
        if (!execute.versions.includes(context.version)) {
            continue;
        }
        enterContext(context, execute.key);
        for (const match of execute.matches) {
            const schemaType = getJsonTypeByRefData(context.schemaData.current);
            const instanceType = getTypeofTypeByRefData(context.instanceData.current);
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
                    enterContext,
                    backContext,
                });
                if (tick === executeConstant.ticks.nextExecute) {
                    break;
                } else if (tick === executeConstant.ticks.endExecute) {
                    backContext(context, execute.key);
                    break executeLoop;
                }
            }
        }
        backContext(context, execute.key);
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
                    enterContext,
                    backContext,
                });
                if (tick === executeConstant.ticks.nextExecute) {
                    break;
                } else if (tick === executeConstant.ticks.endExecute) {
                    backContext(context, execute.key);
                    break executeLoop;
                }
            }
        }
        backContext(context, undefined, execute.key);
    }
    context.endTime = Date.now();
}

/**
 *
 * @param {Context} context
 */
function startValidate(context) {
    startValidateCore(context);
}
export { validate };
