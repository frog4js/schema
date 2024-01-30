import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.minItems,
        version: versionConstant.jsonSchemaVersion.all,
        index: 10,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (
                        context.instanceData.current.$ref[context.instanceData.current.key].length <
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        pushError(context, "minItemsMustBeLessThanOrEqualToLimit", 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
