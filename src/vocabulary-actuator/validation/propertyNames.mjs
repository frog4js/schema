import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { dataOperateUtil } from "../../util/share.mjs";
import { contextManage } from "../../context/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.propertyNames,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 63,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context) => {
                    const schemaValue = context.schemaData.current.$ref[context.schemaData.current.key];
                    const instanceValue = context.instanceData.current.$ref[context.instanceData.current.key];
                    for (const instanceKey of Object.keys(instanceValue)) {
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
