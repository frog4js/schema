import { dataOperateUtil } from "../util/share.mjs";
import { schemaManage } from "../schema/share.mjs";
import { contextManage } from "../context/share.mjs";
import { vocabularyActuatorManage } from "../vocabulary-actuator/share.mjs";
import { errorClass } from "../error/share.mjs";
import { versionConstant, vocabularyActuatorConstant } from "../constants/share.mjs";
/**
 * @typedef import("../../types/share")
 */
/**
 *
 * @type {DefaultConfig}
 */
const systemDefault = {
    baseURI: "https://github.com/frog4js#",
    $schema: versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersionGroups.lastVersions[0]],
    errorMessages: vocabularyActuatorConstant.defaultErrorMessages,
    locale: "en-gb",
};
/**
 *
 * @type {Schema}
 */
const defaultConfigSchema = {
    id: "/default-config#",
    type: "object",
    properties: {
        baseURI: {
            type: "string",
            format: "json-schema-system-base-URI",
        },
        $schema: {
            type: "string",
            enum: schemaManage.getAll$schemaDrafts(),
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
