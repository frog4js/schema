import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maxProperties,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 45,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.jsonTypes.object],
                resolve: (context) => {
                    if (
                        Object.keys(context.instanceData.current.$ref[context.instanceData.current.key]).length >
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        pushError(context, "maxPropertiesMustBeGreaterThanOrEqualToLimit");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
