import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maxLength,
        versions: versionConstant.jsonSchemaVersionGroups.all,
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
                        pushError(context, "maxLengthMustBeGreaterThanOrEqualToLimit");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
