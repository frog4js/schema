import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import { schemaManage } from "../schema/share.mjs";
import { dataOperateUtil } from "../util/share.mjs";
import { jsonSchema$schemaVersionMap } from "../constants/version.mjs";
import { defaultConfigManage } from "../default-config/share.mjs";

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
        defaultConfig = Object.assign(defaultConfigManage.getSystemDefaultConfig(), defaultConfig);
    } else {
        defaultConfig = defaultConfigManage.getSystemDefaultConfig();
    }
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
        version: versionConstant.jsonSchemaVersionGroups.lastVersions[0],
        defaultConfig,
        schemaData: {},
        instanceData: {},
        referenceSchemas: {},
        state: contextConstant.states.init,
        phase: contextConstant.phases.schemaValidate,
        waitValidateRefs: [],
    };
    schemaManage.switchVersion(context, defaultConfig.$schema);
    return context;
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
    for (let i = 0; i < context.schemaPaths.length - 1; i++) {
        const keyOrIndex = context.schemaPaths[i];
        if (keyOrIndex === vocabularyActuatorConstant.pathKeys.ref) {
            current = context.referenceSchemas;
        } else {
            current = current[keyOrIndex];
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
        if (schemaKey !== vocabularyActuatorConstant.pathKeys.ref) {
            context.instanceData.current = getCurrentInstanceRefData(context);
        }
    }
    {
        if (schemaKey !== undefined) {
            context.schemaPaths.push(schemaKey);
        }
        if (schemaKey !== vocabularyActuatorConstant.pathKeys.ref) {
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
export {
    create,
    enterContext,
    backContext,
    getParentInstance,
    getSiblingSchemaRefData,
    getCurrentSchemaRefData,
    getSiblingInstanceRefData,
    getCurrentInstanceRefData,
    getParentSchema,
    canEqualInstance,
};
