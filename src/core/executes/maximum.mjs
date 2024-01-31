import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, mergeError, getSiblingSchemaRefData, getSiblingInstanceRefData } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maximum,
        version: versionConstant.jsonSchemaVersion.all,
        index: 9,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    const siblingSchema = getSiblingSchemaRefData(context, executeConstant.keys.maximumCanEqual);
                    if (siblingSchema.$ref[siblingSchema.key] === false) {
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
