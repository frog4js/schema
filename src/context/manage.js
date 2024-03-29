import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.js";
import { schemaManage } from "../schema/share.js";
import { dataOperateUtil } from "../util/share.js";
import { jsonSchema$schemaVersionMap } from "../constants/version.js";
import { defaultConfigManage } from "../default-config/share.js";
import { deepClone } from "../util/data-operate.js";
import { switchVersion } from "../schema/manage.js";

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
    };
}

/**
 *
 * @param {Context} context
 */
function refererCurrentInstance(context) {
    if (context.instancePaths.length === 0) {
        context.instanceData.current = {
            $ref: { root: context.instanceData.origin },
            key: "root",
        };
        return;
    }
    const current = getParentInstance(context);

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
    const current = getParentSchema(context, true);
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
    const current = getParentSchema(context);
    return { $ref: current, key };
}

/**
 *
 * @param {Context}context
 * @return {*}
 */
function getParentSchema(context) {
    let current;
    context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.origin;
    schemaManage.switchVersion(context, context.schemaData.origin.$schema || context.defaultConfig.$schema);
    for (let i = 0; i < context.schemaPaths.length - 1; i++) {
        const keyOrIndex = context.schemaPaths[i];
        if (keyOrIndex === vocabularyActuatorConstant.pathKeys.ref) {
            current = context.referenceSchemas;
        } else {
            if (!current) {
                console.log(
                    "3333",
                    context.schemaPaths,
                    i,
                    context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self],
                );
            }
            current = current[keyOrIndex];
        }
        if (context.schemaPaths[i - 1] === vocabularyActuatorConstant.pathKeys.ref) {
            context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = current;
            schemaManage.switchVersion(context, current.$schema || context.defaultConfig.$schema);
        }
    }
    return current;
}

function getParentInstance(context) {
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
        refererCurrentInstance(context);
    }
    {
        if (schemaKey !== undefined) {
            context.schemaPaths.push(schemaKey);
        }
        if (schemaKey !== vocabularyActuatorConstant.pathKeys.ref) {
            refererCurrentSchema(context);
        }
    }
}

function backContext(context, schemaKey, instanceKey) {
    if (instanceKey !== undefined) {
        clearCache(context);
        context.instancePaths.pop();
        refererCurrentInstance(context);
    }
    if (schemaKey !== undefined) {
        context.schemaPaths.pop();
        refererCurrentSchema(context);
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
