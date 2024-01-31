import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, mergeError, getSiblingSchemaRefData, getSiblingInstanceRefData } from "../helper.mjs";
import { getTypeofTypesByRefData } from "../../util/type.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maxItems,
        version: versionConstant.jsonSchemaVersion.all,
        index: 11,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (
                        context.instanceData.current.$ref[context.instanceData.current.key].length >
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        pushError(context, "maxItemsMustBeGreaterThanOrEqualToLimit");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
