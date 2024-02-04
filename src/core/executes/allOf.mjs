import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { mergeError, pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.allOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 43,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { enterContext, backContext, startRefOrSchemaExecute }) => {
                    const schemaArrayLength = context.schemaData.current.$ref[context.schemaData.current.key].length;
                    for (let index = 0; index < schemaArrayLength - 1; index++) {
                        enterContext(context, index);
                        const errors = startRefOrSchemaExecute(context, index, undefined);
                        backContext(context, index);
                        if (errors.length > 0) {
                            pushError(context, "allOfMustMatchSchemasInAllOf");
                            break;
                        }
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
