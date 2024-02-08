import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.minProperties,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 45,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.jsonTypes.object],
                resolve: (context) => {
                    if (
                        Object.keys(context.instanceData.current.$ref[context.instanceData.current.key]).length <
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        errorManage.pushError(context, "minPropertiesMustBeLessThanOrEqualToLimit");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
