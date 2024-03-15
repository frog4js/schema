import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { errorManage } from "../../error/share.js";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.minLength,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 15,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.string],
                resolve: (context) => {
                    if (
                        Array.from(context.instanceData.current.$ref[context.instanceData.current.key]).length <
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
