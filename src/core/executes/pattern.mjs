import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, mergeError, getSiblingSchemaRefData, getSiblingInstanceRefData } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.pattern,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 13,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (
                        !new RegExp(context.schemaData.current.$ref[context.schemaData.current.key]).test(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        )
                    ) {
                        pushError(context, "patternMustMatchPattern");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
