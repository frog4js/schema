import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";
import { dataOperateUtil } from "../../util/share.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.uniqueItems,
        versions: versionConstant.jsonSchemaVersionGroups.draft02ByAdd,
        index: 21,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (
                        context.schemaData.current.$ref[context.schemaData.current.key] === true &&
                        dataOperateUtil.fastDeepHasDuplicates(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        )
                    ) {
                        pushError(context, "divisibleByMustNotHaveDuplicateItems");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
