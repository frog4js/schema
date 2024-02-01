import { executeConfigs } from "./executes/share.mjs";
import { executeConstant, typeConstant } from "../constants/share.mjs";
import { getJsonTypeByRefData, getTypeofTypeByRefData } from "../util/type.mjs";
import { getCurrentInstanceRefData, getCurrentSchemaRefData, setLogError } from "./helper.mjs";

/**
 * @typedef {import("../../types/core")}
 */

/**
 *
 * @param {Schema} schema
 * @param {*} instance
 * @param {{phase: "schemaValidate" | "instanceValidate" }} [configs]
 * @return {Context}
 */
function createContext(schema, instance, configs) {
    const context = {
        errors: [],
        tempErrors: [],
        errorState: {
            isTemp: false,
            lockKey: null,
        },
        startTime: Date.now(),
        endTime: Date.now(),
        instancePaths: [],
        schemaPaths: [],
        schemaData: {
            origin: schema,
            current: {
                $ref: { root: schema },
                key: "root",
            },
        },
        instanceData: {
            origin: instance,
            current: {
                $ref: { root: instance },
                key: "root",
            },
        },
        refSchemas: {},
        phase: configs?.phase || "instanceValidate",
    };
    for (const key of Object.keys(schema)) {
        if (key.startsWith("#")) {
            context.refSchemas[key] = schema[key];
        }
    }
    context.refSchemas["#"] = schema;
    return context;
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

function startChildExecute(context, schemaKey, instanceKey) {
    enterContext(context, schemaKey, instanceKey);
    schemaExecute(context);
    backContext(context, schemaKey, instanceKey);
}
/**
 *
 * @param {Context} context
 * @return {ExecuteError[]}
 */
function startRefOrSchemaExecute(context) {
    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
    setLogError(context, true);
    if (typeof schemaValue.$ref === typeConstant.typeofTypes.string) {
        if (schemaValue.$ref.startsWith("#") && context.refSchemas[schemaValue.$ref]) {
            enterContext(context, executeConstant.pathKeys.ref);
            enterContext(context, schemaValue.$ref);
            schemaExecute(context);
            backContext(context, schemaValue.$ref);
            backContext(context, executeConstant.pathKeys.ref);
        } else {
            // TODO
        }
    } else {
        schemaExecute(context);
    }
    if (setLogError(context, false)) {
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
function schemaExecute(context) {
    executeLoop: for (let execute of executeConfigs) {
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
                    startRefOrSchemaExecute,
                    startChildExecute,
                    enterContext,
                    backContext,
                    startExecute,
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
 * @param {Schema} schema
 * @param {any} instance
 * @param {{phase: "schemaValidate" | "instanceValidate" }} [configs]
 * @return {Context}
 */
function startExecute(schema, instance, configs) {
    const context = createContext(schema, instance, configs);
    schemaExecute(context);
    return context;
}

export { startExecute, createContext, enterContext, backContext, startRefOrSchemaExecute, startChildExecute };
