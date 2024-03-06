import { vocabularyActuatorManage } from "../vocabulary-actuator/share.mjs";
import metaSchemas from "../meta-schemas/share.mjs";
import { dataOperateUtil, typeUtil, urlUtil } from "../util/share.mjs";
import { contextConstant, vocabularyActuatorConstant, typeConstant, versionConstant } from "../constants/share.mjs";
import { errorClass } from "../error/share.mjs";

/**
 * @typedef {import("../../types/share")}
 */

/**
 *
 * @param {Context} context
 * @param {string} draft$schema
 */
function switchVersion(context, draft$schema) {
    const version = versionConstant.jsonSchema$schemaVersionMap[draft$schema];
    if (!version) {
        return;
    }
    const metaSchemasByVersion = metaSchemas[version];
    if (!metaSchemasByVersion) {
        return;
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
        throw new errorClass.SystemError(`state does not equal init. current state is ${context.state}`);
    }
    if (!context.schemaData.main) {
        throw new errorClass.SystemError(`main schema not set`);
    }
    for (const waitValidateRef of context.waitValidateRefs) {
        let current;
        if (context.referenceSchemas[waitValidateRef.$ref]) {
            current = context.referenceSchemas[vocabularyActuatorConstant.pathKeys.self];
        } else {
            const result = urlUtil.calculateIdAndPointer(waitValidateRef.$ref, context.defaultConfig.baseURI);
            if (result && context.referenceSchemas[result.id]) {
                current = dataOperateUtil.getValueByJsonPointer(context.referenceSchemas[result.id], result.pointer);
            }
            if (current) {
                context.referenceSchemas[waitValidateRef.$ref] = current;
            }
        }
        if (typeUtil.getTypeofType(current) !== typeConstant.typeofTypes.object) {
            throw new errorClass.SystemError(`${waitValidateRef.$ref} not found or is not a valid schema`);
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
export { setMainSchema, addReferenceSchema, switchVersion, compile, getAll$schemaDrafts, getLast$schemaDraft };
