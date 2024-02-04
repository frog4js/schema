import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, getSiblingSchemaRefData } from "../helper.mjs";
import { typeUtil } from "../../util/share.mjs";

/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.additionalItems,
        versions: versionConstant.jsonSchemaVersionGroups.draft03ByAdd,
        index: 7,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        const parentSchemaInfo = getSiblingSchemaRefData(context, executeConstant.keys.items);
                        const items = parentSchemaInfo.$ref[parentSchemaInfo.key];
                        if (
                            typeUtil.getTypeofType(items) === typeConstant.typeofTypes.array &&
                            context.instanceData.current.$ref[context.instanceData.current.key].length > items.length
                        ) {
                            pushError(context, "additionalItemsMustNotHaveMoreItems");
                        }
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startChildExecute }) => {
                    const parentSchemaInfo = getSiblingSchemaRefData(context, executeConstant.keys.items);
                    const items = parentSchemaInfo.$ref[parentSchemaInfo.key];
                    if (typeUtil.getTypeofType(items) === typeConstant.typeofTypes.array) {
                        const instanceCount =
                            context.instanceData.current.$ref[context.instanceData.current.key].length;
                        for (let moreItemIndex = items.length; moreItemIndex < instanceCount; moreItemIndex++) {
                            startChildExecute(context, undefined, moreItemIndex);
                        }
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
