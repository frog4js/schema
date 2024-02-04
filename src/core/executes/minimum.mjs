import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, canEqualInstance } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.minimum,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 8,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (canEqualInstance(context) === false) {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] <=
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            pushError(context, "minimumMustBeLessThanLimit");
                        }
                    } else {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] <
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            pushError(context, "minimumMustBeLessThanOrEqualToLimit");
                        }
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
