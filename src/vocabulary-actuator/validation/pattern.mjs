import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.pattern,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 13,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.string],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (
                        !new RegExp(context.schemaData.current.$ref[context.schemaData.current.key]).test(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        )
                    ) {
                        errorManage.pushError(context, "patternMustMatchPattern");
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;