import { engine } from "../core/share.mjs";
import { draft } from "../definition/share.mjs";
import { dataOperateUtil, typeUtil } from "../util/share.mjs";
import crypto from "node:crypto";
const drafts = Object.values(draft);

function getId(schema) {
    return schema.$id || schema.id;
}

/**
 *
 * @param {Record<string, *> | Schema} json
 * @return {Schema}
 */
function create(json) {
    typeUtil.assertObject(json);
    const deepCloneSchema = dataOperateUtil.deepClone(json);

    let useDraft = draft.draft01;
    if (deepCloneSchema?.$schema) {
        useDraft = drafts.find((x) => getId(x) === json.$schema);
    }

    deepCloneSchema.$schema = getId(useDraft);
    if (!deepCloneSchema.$id) {
        deepCloneSchema.$id = "random-" + crypto.randomUUID();
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
