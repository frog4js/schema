import { engine } from "../core/share.mjs";
import { draft } from "../definition/share.mjs";
import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import { typeConstant, versionConstant } from "../constants/share.mjs";
const drafts = Object.values(draft);

function getId(schema) {
    return schema.$id || schema.id;
}

function assignDefault(defaultConfig) {
    return Object.assign(
        {
            baseURI: "https://github.com/frog4js/schema",
        },
        defaultConfig,
    );
}
/**
 *
 * @param {Record<string, *> | Schema} json
 * @param {{baseURI}} defaultConfig
 * @return {Schema}
 */
function create(json, defaultConfig) {
    defaultConfig = assignDefault(defaultConfig);
    if (typeUtil.getTypeofType(json) !== typeConstant.typeofTypes.object) {
        throw new Error(`schema is invalid: must be a JSON object`);
    }
    const deepCloneSchema = dataOperateUtil.deepClone(json);
    let useDraft = draft.draft01;
    for (const $schema of Object.keys(versionConstant.jsonSchema$schemaVersionMap)) {
        if (
            versionConstant.jsonSchema$schemaVersionMap[$schema] ===
            versionConstant.jsonSchemaVersionGroups.lastVersions[0]
        ) {
            useDraft = drafts.find((x) => getId(x) === $schema);
        }
    }
    if (deepCloneSchema?.$schema) {
        const findItem = drafts.find((x) => getId(x) === json.$schema);
        if (findItem) {
            useDraft = findItem;
        }
    }
    if (!useDraft) {
        throw new Error(`schema is invalid: $schema must be a valid value`);
    }

    deepCloneSchema.$schema = getId(useDraft);
    if (getId(deepCloneSchema)) {
        const url = new URL(getId(deepCloneSchema), defaultConfig.baseURI);
        //deepCloneSchema.$id = url.href;
    }
    const context = engine.startExecute(useDraft, deepCloneSchema);
    if (context.errors.length > 0) {
        throw new Error(`schema is invalid: ${dataOperateUtil.toString(context.errors, undefined)}`);
    }
    for (const key of Object.keys(json)) {
        if (key.startsWith("#")) {
            const childContext = engine.startExecute(useDraft, dataOperateUtil.deepClone(json[key]));
            if (childContext.errors.length > 0) {
                throw new Error(`${key} schema is invalid: ${dataOperateUtil.toString(childContext.errors)}`);
            }
            context.instanceData.origin[key] = childContext.instanceData.origin;
        }
    }
    return context.instanceData.origin;
}
export { create };
