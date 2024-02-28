import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { dataOperateUtil } from "../../util/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.const,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 62,
        matches: [
            {
                schemaTypes: typeConstant.jsonTypeGroups.exist,
                resolve: (context) => {
                    const result = dataOperateUtil.fastDeepHasDuplicates([
                        context.schemaData.current.$ref[context.schemaData.current.key],
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    ]);
                    if (!result) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
