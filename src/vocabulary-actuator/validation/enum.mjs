import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.enum,
        versions: versionConstant.jsonSchemaVersionGroups.all,
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
                        errorManage.pushError(context, "enumMustBeEqualToOneOfTheEnumValues");
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
