import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.js";
import { schemaManage } from "../schema/share.js";
import { dataOperateUtil } from "../util/share.js";
import { defaultConfigManage } from "../default-config/share.js";

/**
 * @typedef {import("../../types/share")}
 */

/**
 *
 * @param {DefaultConfig} [defaultConfig]
 * @return {Context}
 * @throws {Error}
 */
function create(defaultConfig) {
    if (defaultConfig) {
        defaultConfigManage.validate(defaultConfig);
        defaultConfig = dataOperateUtil.merge(
            dataOperateUtil.deepClone(defaultConfigManage.getSystemDefaultConfig()),
            defaultConfig,
        );
    } else {
        defaultConfig = defaultConfigManage.getSystemDefaultConfig();
    }
    const context = {
        errors: [],
        startTime: Date.now(),
        endTime: Date.now(),
        instancePaths: [],
        schemaPaths: [],
        version: versionConstant.jsonSchemaVersionGroups.lastVersions[0],
        defaultConfig,
        schemaData: {},
        instanceData: {},
        referenceSchemas: {},
        state: contextConstant.states.init,
        phase: contextConstant.phases.schemaValidate,
        waitValidateRefs: [],
        locks: [],
        schemaHistory: [],
        instanceHistory: [],
    };
    schemaManage.switchVersion(context, defaultConfig.$schema);
    return context;
}

/**
 *
 * @param {Context} context
 * @return {Context}
 */
function clone(context) {
    return {
        errors: [],
        startTime: Date.now(),
        endTime: Date.now(),
        instancePaths: [],
        schemaPaths: [],
        version: context.version,
        defaultConfig: context.defaultConfig,
        schemaData: {},
        instanceData: {},
        referenceSchemas: Object.assign({}, context.referenceSchemas),
        state: contextConstant.states.init,
        phase: contextConstant.phases.schemaValidate,
        waitValidateRefs: [],
        locks: [],
        caches: [],
        schemaHistory: [],
        instanceHistory: [],
    };
}

/**
 *
 * @param {Context} context
 */
function refererCurrentInstance(context) {
    context.instanceHistory = [];
    if (context.instancePaths.length === 0) {
        context.instanceData.current = {
            $ref: { root: context.instanceData.origin },
            key: "root",
        };
        return;
    }
    const current = getParentInstance(context, true);
    if (!context.instanceData.current) {
        context.instanceData.current = { $ref: current, key: context.instancePaths[context.instancePaths.length - 1] };
    } else {
        context.instanceData.current.$ref = current;
        context.instanceData.current.key = context.instancePaths[context.instancePaths.length - 1];
    }
}

/**
 *
 * @param {Context} context
 */
function refererCurrentSchema(context) {
    context.schemaHistory = [];
    context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.origin;
    const current = getParentSchema(context, true);
    schemaManage.switchVersion(context, context.schemaData.origin.$schema || context.defaultConfig.$schema);
    if (!context.schemaData.current) {
        context.schemaData.current = { $ref: current, key: context.schemaPaths[context.schemaPaths.length - 1] };
    } else {
        context.schemaData.current.$ref = current;
        context.schemaData.current.key = context.schemaPaths[context.schemaPaths.length - 1];
    }
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
    return { $ref: context.instanceData.current.$ref, key };
}

/**
 *
 * @param {Context}context
 * @param {string} key
 * @return {RefData}
 */
function getSiblingSchemaRefData(context, key) {
    return { $ref: context.schemaData.current.$ref, key };
}

/**
 *
 * @param {Context}context
 * @param {boolean}recordHistory
 * @return {*}
 */
function getParentSchema(context, recordHistory) {
    let current;
    for (let i = 0; i < context.schemaPaths.length - 1; i++) {
        const keyOrIndex = context.schemaPaths[i];
        if (keyOrIndex === vocabularyActuatorConstant.pathKeys.ref) {
            current = context.referenceSchemas;
        } else {
            current = current[keyOrIndex];
        }
        recordHistory && context.schemaHistory.push(current);
        if (context.schemaPaths[i - 1] === vocabularyActuatorConstant.pathKeys.ref) {
            context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = current;
            schemaManage.switchVersion(context, current.$schema || context.defaultConfig.$schema);
        }
    }
    return current;
}

function getParentInstance(context, recordHistory) {
    let current = context.instanceData.origin;
    for (let i = 0; i < context.instancePaths.length - 1; i++) {
        const keyOrIndex = context.instancePaths[i];
        if (keyOrIndex === vocabularyActuatorConstant.pathKeys.objectKey) {
            current = Object.keys(current).reduce((acc, key) => {
                acc[key] = key;
                return acc;
            }, {});
        } else {
            current = current[keyOrIndex];
        }
        recordHistory && context.instanceHistory.push(current);
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
    if (!context.instanceData.current) {
        refererCurrentInstance(context);
    }
    if (!context.schemaData.current) {
        refererCurrentSchema(context);
    }
    if (instanceKey !== undefined) {
        context.instancePaths.push(instanceKey);
        if (vocabularyActuatorConstant.pathKeys.objectKey === instanceKey) {
            context.instanceData.current.$ref = {
                root: Object.keys(context.instanceData.current.$ref[context.instanceData.current.key]).reduce(
                    (acc, key) => {
                        acc[key] = key;
                        return acc;
                    },
                    {},
                ),
            };
            context.instanceData.current.key = "root";
        } else {
            context.instanceData.current.$ref = context.instanceData.current.$ref[context.instanceData.current.key];
            context.instanceData.current.key = instanceKey;
        }
        context.instanceHistory.push(context.instanceData.current.$ref);
    }
    if (schemaKey !== undefined) {
        context.schemaPaths.push(schemaKey);
        if (vocabularyActuatorConstant.pathKeys.ref === schemaKey) {
            // context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.current.$ref[context.schemaData.current.key];
            // schemaManage.switchVersion(context, context.schemaData.current.$ref[context.schemaData.current.key].$schema || context.defaultConfig.$schema);
        } else if (context.schemaPaths[context.schemaPaths.length - 2] === vocabularyActuatorConstant.pathKeys.ref) {
            refererCurrentSchema(context);

            // context.schemaData.current.$ref = context.referenceSchemas;
            // context.schemaData.current.key = schemaKey;
            // context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.current.$ref[context.schemaData.current.key];
            // schemaManage.switchVersion(context, context.schemaData.current.$ref[context.schemaData.current.key].$schema || context.defaultConfig.$schema);
        } else {
            context.schemaData.current.$ref = context.schemaData.current.$ref[context.schemaData.current.key];
            context.schemaData.current.key = schemaKey;
        }
        context.schemaHistory.push(context.schemaData.current.$ref);
    }
}
/**
 *
 * @param {Context} context
 * @param schemaKey
 * @param instanceKey
 */
function backContext(context, schemaKey, instanceKey) {
    if (instanceKey !== undefined) {
        clearCache(context);
        context.instancePaths.pop();
        context.instanceHistory.pop();
        if (context.instanceHistory.length === 0) {
            context.instanceData.current.$ref = { root: context.instanceData.origin };
            context.instanceData.current.key = "root";
        } else {
            context.instanceData.current.$ref = context.instanceHistory[context.instanceHistory.length - 1];
            context.instanceData.current.key = context.instancePaths[context.instancePaths.length - 1];
        }
    }
    if (schemaKey !== undefined) {
        context.schemaPaths.pop();
        context.schemaHistory.pop();

        if (context.schemaHistory.length === 0) {
            context.schemaData.current.$ref = context.referenceSchemas;
            context.schemaData.current.key = vocabularyActuatorConstant.pathKeys.self;
        } else {
            context.schemaData.current.$ref = context.schemaHistory[context.schemaHistory.length - 1];
            if (vocabularyActuatorConstant.pathKeys.ref === schemaKey) {
            } else if (
                context.schemaPaths[context.schemaPaths.length - 2] === vocabularyActuatorConstant.pathKeys.ref
            ) {
                refererCurrentSchema(context);

                // context.schemaData.current.key = context.schemaPaths[context.schemaPaths.length - 1];
                // context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.current.$ref[context.schemaData.current.key];
                // schemaManage.switchVersion(context, context.schemaData.current.$ref[context.schemaData.current.key].$schema || context.defaultConfig.$schema);
            } else {
                context.schemaData.current.key = context.schemaPaths[context.schemaPaths.length - 1];
            }
        }
    }
}

/**
 *
 * @param {Context} context
 * @return { boolean}
 */
function canEqualInstance(context) {
    if (context.version < versionConstant.jsonSchemaVersions.draft03) {
        let siblingSchema;
        if (context.schemaData.current.key === vocabularyActuatorConstant.keys.maximum) {
            siblingSchema = getSiblingSchemaRefData(context, vocabularyActuatorConstant.keys.maximumCanEqual);
        } else if (context.schemaData.current.key === vocabularyActuatorConstant.keys.minimum) {
            siblingSchema = getSiblingSchemaRefData(context, vocabularyActuatorConstant.keys.minimumCanEqual);
        }
        if (siblingSchema) {
            return siblingSchema.$ref[siblingSchema.key];
        }
    } else {
        let siblingSchema;
        if (context.schemaData.current.key === vocabularyActuatorConstant.keys.maximum) {
            siblingSchema = getSiblingSchemaRefData(context, vocabularyActuatorConstant.keys.exclusiveMaximum);
        } else if (context.schemaData.current.key === vocabularyActuatorConstant.keys.minimum) {
            siblingSchema = getSiblingSchemaRefData(context, vocabularyActuatorConstant.keys.exclusiveMinimum);
        }
        if (siblingSchema) {
            return !siblingSchema.$ref[siblingSchema.key];
        }
    }
    return true;
}

/**
 *
 * @param {Context} context
 */
function lock(context) {
    const current = dataOperateUtil.deepClone(context.schemaPaths);
    if (context.locks.length === 0) {
        context.locks.push({
            paths: current,
            errors: [],
        });
        return true;
    }
    const lastLock = context.locks[context.locks.length - 1];
    const result = dataOperateUtil.compareToArray(current, lastLock.paths);
    if (result === 0) {
        return true;
    }
    if (result === 2) {
        context.locks.push({
            paths: current,
            errors: [],
        });
        return true;
    }
    return false;
}

/**
 *
 * @param {Context} context
 * @return {{errors: Array, paths: Array<string>}}
 */
function unlock(context) {
    return context.locks.pop();
}

/**
 *
 * @param {Context}context
 * @param {string}key
 * @param {*}value
 * @param {number} [backSchemaLevel]
 * @param {number} [backInstanceLevel]
 */
function setCache(context, key, value, backSchemaLevel = 0, backInstanceLevel = 0) {
    const schemaPaths = dataOperateUtil.deepClone(context.schemaPaths) || [];
    for (let i = 0; i < backSchemaLevel; i++) {
        schemaPaths.pop();
    }
    const instancePaths = dataOperateUtil.deepClone(context.instancePaths) || [];
    for (let i = 0; i < backInstanceLevel; i++) {
        instancePaths.pop();
    }
    for (const cache of context.caches) {
        let result = dataOperateUtil.compareToArray(schemaPaths, cache.schemaPaths);
        if (result !== 0) {
            continue;
        }
        result = dataOperateUtil.compareToArray(context.instancePaths, instancePaths);
        if (result === 0) {
            cache.data[key] = value;
            return;
        }
    }
    context.caches.push({
        schemaPaths: schemaPaths,
        instancePaths: instancePaths,
        data: {
            [key]: value,
        },
    });
}

/**
 *
 * @param {Context} context
 * @param {string} key
 * @param {number} [backSchemaLevel]
 * @param {number} [backInstanceLevel]
 * @return {* | undefined}
 */
function getCache(context, key, backSchemaLevel = 0, backInstanceLevel = 0) {
    const schemaPaths = dataOperateUtil.deepClone(context.schemaPaths) || [];
    for (let i = 0; i < backSchemaLevel; i++) {
        schemaPaths.pop();
    }
    const instancePaths = dataOperateUtil.deepClone(context.instancePaths) || [];
    for (let i = 0; i < backInstanceLevel; i++) {
        instancePaths.pop();
    }
    for (const cache of context.caches) {
        let result = dataOperateUtil.compareToArray(schemaPaths, cache.schemaPaths);
        if (result !== 0) {
            continue;
        }
        result = dataOperateUtil.compareToArray(instancePaths, cache.instancePaths);
        if (result === 0) {
            return cache.data[key];
        }
    }
    return undefined;
}

/**
 *
 * @param {Context}context
 */
function clearCache(context) {
    const index = context.caches.findIndex((cache) => {
        const result1 = dataOperateUtil.compareToArray(context.schemaPaths, cache.schemaPaths);
        const result2 = dataOperateUtil.compareToArray(context.instancePaths, cache.instancePaths);
        return result1 === 0 && result2 === 0;
    });
    if (index !== -1) {
        context.caches.splice(index, 1);
    }
}

export {
    create,
    enterContext,
    backContext,
    getParentInstance,
    getSiblingSchemaRefData,
    getSiblingInstanceRefData,
    getParentSchema,
    canEqualInstance,
    lock,
    unlock,
    clone,
    setCache,
    clearCache,
    getCache,
};
