import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { mergeError, pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.anyOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 42,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { enterContext, backContext, startRefOrSchemaExecute }) => {
                    const schemaArrayLength = context.schemaData.current.$ref[context.schemaData.current.key].length;
                    let status = false;
                    for (let index = 0; index < schemaArrayLength; index++) {
                        enterContext(context, index);
                        const errors = startRefOrSchemaExecute(context, index, undefined);
                        backContext(context, index);
                        if (errors.length === 0) {
                            status = true;
                            break;
                        }
                    }
                    if (!status) {
                        pushError(context, "anyOfMustMatchASchemaInAnyOf");
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
