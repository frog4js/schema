import { contextConstant, typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { dataOperateUtil } from "../../util/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { vocabularyActuatorManage } from "../share.mjs";
import { pushError } from "../../error/manage.mjs";

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
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const instanceValue = context.instanceData.current.$ref[context.instanceData.current.key];
                    const errors = [];
                    for (const instanceKey of Object.keys(instanceValue)) {
                        contextManage.enterContext(context, undefined, vocabularyActuatorConstant.pathKeys.objectKey);
                        contextManage.enterContext(context, undefined, instanceKey);
                        errors.push(...startRefOrSchemaExecute(context, true));
                        contextManage.backContext(context, undefined, vocabularyActuatorConstant.pathKeys.objectKey);
                        contextManage.backContext(context, undefined, instanceKey);
                    }
                    if (errors.length > 0) {
                        pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
