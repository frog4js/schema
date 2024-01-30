import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, mergeError, getSiblingSchemaRefData, getSiblingInstanceRefData } from "../helper.mjs";
import { getTypeofTypesByRefData } from "../../util/type.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.minLength,
        version: versionConstant.jsonSchemaVersion.all,
        index: 15,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (
                        context.instanceData.current.$ref[context.instanceData.current.key].length <
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        pushError(context, "minLengthMustBeLessThanOrEqualToLimit", 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
