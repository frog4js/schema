import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.exclusiveMinimum,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 60,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (
                        context.instanceData.current.$ref[context.instanceData.current.key] <=
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
