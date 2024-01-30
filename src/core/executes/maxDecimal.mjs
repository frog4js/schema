import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError } from "../helper.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.maxDecimal,
        version: versionConstant.jsonSchemaVersion.all,
        index: 17,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    const stringInstance = String(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    ).split(".");
                    if (
                        stringInstance.length === 2 &&
                        stringInstance[1] &&
                        stringInstance[1].length > context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        pushError(context, "maxDecimalMustBeLessThanOrEqualToLimit", 1);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
