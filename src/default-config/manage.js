import { schemaManage } from "../schema/share.js";
import { contextManage } from "../context/share.js";
import { vocabularyActuatorManage } from "../vocabulary-actuator/share.js";
import { errorClass } from "../error/share.js";
import { versionConstant, vocabularyActuatorConstant } from "../constants/share.js";
/**
 * @typedef import("../../types/share")
 */
/**
 *
 * @type {DefaultConfig}
 */
const systemDefault = {
    baseURI: "https://github.com/frog4js/",
    $schema: versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersionGroups.lastVersions[0]],
    errorMessages: vocabularyActuatorConstant.defaultErrorMessages,
    locale: "en-gb",
    strict: true,
    useDefaults: true,
};
/**
 *
 * @type {Schema}
 */
const defaultConfigSchema = {
    $id: "default-config",
    type: "object",
    properties: {
        baseURI: {
            type: "string",
            format: "json-schema-system-base-URI",
        },
        $schema: {
            type: "string",
            enum: Object.values(versionConstant.jsonSchema$schemaDraftMap),
        },
        errorMessages: {
            type: "object",
            additionalProperties: {
                type: "object",
                additionalProperties: {
                    type: "string",
                },
            },
        },
        locale: {
            type: "string",
        },
        strict: {
            type: "boolean",
        },
        useDefaults: {
            type: "boolean",
        },
    },
    additionalProperties: false,
};
/**
 * @type {Context}
 */
let context;

/**
 *
 * @param {DefaultConfig} defaultConfig
 * @throws {Error}
 */
export function validate(defaultConfig) {
    if (!context) {
        context = contextManage.create();
        schemaManage.setMainSchema(context, defaultConfigSchema);
        schemaManage.compile(context);
    }
    const { valid, errors } = vocabularyActuatorManage.validate(context, defaultConfig);
    if (!valid) {
        throw new errorClass.DefaultConfigError(errors);
    }
}

/**
 *
 * @return {DefaultConfig}
 */
export function getSystemDefaultConfig() {
    return systemDefault;
}
