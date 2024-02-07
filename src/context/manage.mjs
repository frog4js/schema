import { versionConstant } from "../constants/share.mjs";
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

export { create };
