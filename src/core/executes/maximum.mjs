import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, canEqualInstance } from "../helper.mjs";
/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maximum,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 9,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (canEqualInstance(context) === false) {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] >=
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            pushError(context, "maximumMustBeLessThanLimit");
                        }
                    } else {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] >
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            pushError(context, "maximumMustBeLessThanOrEqualToLimit");
                        }
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
