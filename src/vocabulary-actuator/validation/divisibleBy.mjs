import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.divisibleBy,
        versions: [versionConstant.jsonSchemaVersions.draft02, versionConstant.jsonSchemaVersions.draft03],
        index: 20,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] !== 0) {
                        const val =
                            context.instanceData.current.$ref[context.instanceData.current.key] %
                            context.schemaData.current.$ref[context.schemaData.current.key];
                        if (val !== 0) {
                            pushError(context, "divisibleByMustBeDivisible");
                        }
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
