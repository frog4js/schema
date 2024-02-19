import { vocabularyActuatorManage } from "../vocabulary-actuator/share.mjs";
import metaSchemas from "../meta-schemas/share.mjs";
import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import { errorClass } from "../error/share.mjs";

/**
 * @typedef {import("../../types/context").JSONSchema.Context} Context
 * @typedef {import("../../types/schema").JSONSchema.Schema} Schema
 */

/**
 *
 * @param {Context} context
 * @param {string} draft$schema
 */
function switchVersion(context, draft$schema) {
    const version = versionConstant.jsonSchema$schemaVersionMap[draft$schema];
    if (!version) {
        throw new Error("TODO11");
    }
    const metaSchemasByVersion = metaSchemas[version];
    if (!metaSchemasByVersion) {
        throw new Error("TODO10");
    }
    metaSchemasByVersion.forEach((item) => (context.referenceSchemas[item.id || item.$id] = item));
    context.version = version;
}

/**
 *
 * @param {Context}context
 * @param {Schema}schema
 */
function addReferenceSchema(context, schema) {
    validateSchema(context, dataOperateUtil.deepClone(schema));
}

/**
 *
 * @param {Context}context
 * @param {Schema}schema
 */
function validateSchema(context, schema) {
    if (!context.referenceSchemas[context.defaultConfig.$schema]) {
        throw new errorClass.SystemError(`not found ${context.defaultConfig.$schema} in referenceSchemas`);
    }
    context.schemaData.origin = context.referenceSchemas[context.defaultConfig.$schema];
    context.schemaPaths = [vocabularyActuatorConstant.pathKeys.ref, vocabularyActuatorConstant.pathKeys.self];
    context.instanceData.origin = schema;
    context.phase = contextConstant.phases.schemaValidate;
    context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.origin;
    vocabularyActuatorManage.startValidate(context);
    if (context.errors.length) {
        throw new errorClass.SchemaInvalidError(context.errors);
    }
}

/**
 *
 * @param {Context} context
 * @param {Schema} schema
 */
function setMainSchema(context, schema) {
    context.schemaData.main = dataOperateUtil.deepClone(schema);
    validateSchema(context, context.schemaData.main);
}

/**
 *
 * @param {Context} context
 */
function compile(context) {
    if (context.state !== contextConstant.states.init) {
        throw new errorClass.SystemError(`state does not equal init. current state is${context.state}`);
    }
    if (!context.schemaData.main) {
        throw new errorClass.SystemError(`main schema not set`);
    }
    for (const waitValidateRef of context.waitValidateRefs) {
        const paths = dataOperateUtil.getPathsByRef({ $ref: waitValidateRef.$ref });
        let current;
        if (paths[0] === vocabularyActuatorConstant.pathKeys.self) {
            current = dataOperateUtil.getValueByJsonPointer(waitValidateRef.schema, waitValidateRef.$ref);
        } else {
            current = dataOperateUtil.getValueByJsonPointer(
                context.referenceSchemas[paths.shift()],
                "#" + paths.join("/"),
            );
        }

        if (typeUtil.getTypeofType(current) !== typeConstant.typeofTypes.object) {
            throw new errorClass.SystemError(`${waitValidateRef.$ref} not found or is not a valid schema.`);
        }
    }
    context.state = contextConstant.states.compile;
    context.schemaData.origin = context.schemaData.main;
    context.schemaPaths = [vocabularyActuatorConstant.pathKeys.ref, vocabularyActuatorConstant.pathKeys.self];
    context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self] = context.schemaData.origin;
}

/**
 *
 * @return {string}
 */
function getLast$schemaDraft() {
    return versionConstant.jsonSchema$schemaDraftMap[versionConstant.jsonSchemaVersionGroups.lastVersions[0]];
}

/**
 *
 * @return {string[]}
 */
function getAll$schemaDrafts() {
    return Object.values(versionConstant.jsonSchema$schemaDraftMap);
}
export { setMainSchema, addReferenceSchema, switchVersion, compile, getLast$schemaDraft, getAll$schemaDrafts };
