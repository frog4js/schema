import { vocabularyActuatorManage } from "../vocabulary-actuator/share.mjs";
import metaSchemas from "../meta-schemas/share.mjs";
import { dataOperateUtil } from "../util/share.mjs";
import { versionConstant } from "../constants/share.mjs";
const metaSchemaMap = {};
metaSchemas.forEach((metaSchema) => (metaSchemaMap[metaSchema.id || metaSchema.$id] = metaSchema));
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
    const schemaObject = metaSchemaMap[draft$schema];
    if (!version || !schemaObject) {
        throw new Error("TODO");
    }
    return metaSchemaMap[draft$schema];
}

/**
 *
 * @param {Context}context
 * @param {Schema}schema
 */
function addReferenceSchema(context, schema) {
    validateSchema(context, schema);
    // context.cacheReferenceSchemas = {
    //     schema
    // }
}
/**
 *
 * @param {Context}context
 * @param {Schema}schema
 */
function validateSchema(context, schema) {
    if (!context.schemaData.origin) {
        if (!metaSchemaMap[context.defaultConfig.$schema]) {
            throw new Error("TODO");
        }
        context.schemaData.origin = metaSchemaMap[context.defaultConfig.$schema];
    }
    context.schemaData.current = { $ref: { root: context.schemaData.origin }, key: "root" };
    context.schemaPaths = [];
    vocabularyActuatorManage.validate(context, schema);
    if (context.errors.length) {
        throw new Error(`schema is invalid: ${dataOperateUtil.toString(context.errors, undefined)}`);
    }
}
/**
 *
 * @param {Context} context
 * @param {Schema} schema
 */
function setMainSchema(context, schema) {
    validateSchema(context, schema);
}
export { setMainSchema, addReferenceSchema, switchVersion };
