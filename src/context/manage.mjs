import { executeConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import { schemaManage } from "../schema/share.mjs";

const systemDefault = {
    $schema: "http://json-schema.org/draft-04/schema#",
    baseURI: "https://github.com/frog4js",
};

/**
 * @typedef {import("../../types/context").JSONSchema.Context} Context
 * @typedef {import("../../types/context").JSONSchema.DefaultConfig} DefaultConfig
 */

/**
 *
 * @param {DefaultConfig} [defaultConfig]
 * @return {Context}
 */
function create(defaultConfig) {
    defaultConfig = Object.assign({}, systemDefault, defaultConfig);
    new URL(defaultConfig.baseURI);
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
        cacheReferenceSchemas: {},
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
