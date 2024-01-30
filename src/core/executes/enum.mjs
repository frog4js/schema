import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, mergeError, getSiblingSchemaRefData, getSiblingInstanceRefData } from "../helper.mjs";
import { getTypeofTypesByRefData } from "../../util/type.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.enum,
        version: versionConstant.jsonSchemaVersion.all,
        index: 16,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (
                        !context.schemaData.current.$ref[context.schemaData.current.key].includes(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        )
                    ) {
                        pushError(context, "enumMustBeEqualToOneOfTheEnumValues", 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;