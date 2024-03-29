import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { errorManage } from "../../error/share.js";
import { dataOperateUtil } from "../../util/share.js";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.uniqueItems,
        versions: versionConstant.jsonSchemaVersionGroups.draft02ByAdd,
        index: 21,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (
                        context.schemaData.current.$ref[context.schemaData.current.key] === true &&
                        dataOperateUtil.fastDeepHasDuplicates(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        )
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
