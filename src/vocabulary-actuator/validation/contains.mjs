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
        key: vocabularyActuatorConstant.keys.contains,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 64,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const instanceValue = context.instanceData.current.$ref[context.instanceData.current.key];
                    let status = false;
                    for (let index = 0; index < instanceValue.length; index++) {
                        contextManage.enterContext(context, undefined, index);
                        const errors = startRefOrSchemaExecute(context, true);
                        if (errors.length === 0) {
                            status = true;
                        }
                        contextManage.backContext(context, undefined, index);
                    }
                    if (!status) {
                        pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
