import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.oneOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 41,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: typeConstant.typeofTypeGroups.exist,
                resolve: (context, { enterContext, backContext, startRefOrSchemaExecute }) => {
                    let matchCount = 0;
                    const schemaArrayLength = context.schemaData.current.$ref[context.schemaData.current.key].length;
                    for (let index = 0; index < schemaArrayLength; index++) {
                        enterContext(context, index);
                        const errors = startRefOrSchemaExecute(context, index, undefined);
                        if (errors.length === 0) {
                            matchCount++;
                        }
                        backContext(context, index);
                    }
                    if (matchCount !== 1) {
                        pushError(context, "oneOfMustMatchExactlyOneSchemaInOneOf");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
