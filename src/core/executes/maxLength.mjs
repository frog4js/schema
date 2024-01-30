import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maxLength,
        version: versionConstant.jsonSchemaVersion.all,
        index: 14,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (
                        context.instanceData.current.$ref[context.instanceData.current.key].length >
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        pushError(context, "maxLengthMustBeGreaterThanOrEqualToLimit", 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
