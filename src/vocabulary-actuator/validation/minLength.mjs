import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.minLength,
        versions: versionConstant.jsonSchemaVersionGroups.all,
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
                        errorManage.pushError(context, "minLengthMustBeLessThanOrEqualToLimit");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
