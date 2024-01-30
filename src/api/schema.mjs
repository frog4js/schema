import { engine } from "../core/share.mjs";
import { draft } from "../definition/share.mjs";
import { typeUtil } from "../util/share.mjs";
import crypto from "node:crypto";
const drafts = Object.values(draft);

function getId(schema) {
    return schema.$id || schema.id;
}

/**
 *
 * @param {Record<string, *>} json
 * @return {Schema}
 */
function create(json) {
    typeUtil.assertObject(json);
    const deepCloneSchema = JSON.parse(JSON.stringify(json));

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
        throw new Error(`schema is invalid: ${JSON.stringify(context.errors, undefined, 2)}`);
    }
    for (const key of Object.keys(json)) {
        if (key.startsWith("#")) {
            const childContext = engine.startExecute(useDraft, JSON.parse(JSON.stringify(json[key])));
            if (childContext.errors.length > 0) {
                throw new Error(`${key} schema is invalid: ${JSON.stringify(context.errors, undefined, 2)}`);
            }
            context.instanceData.origin[key] = childContext.instanceData.origin;
        }
    }
    return context.instanceData.origin;
}
export { create };
