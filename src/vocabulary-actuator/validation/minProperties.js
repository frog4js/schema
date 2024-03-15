import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { errorManage } from "../../error/share.js";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.minProperties,
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
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
