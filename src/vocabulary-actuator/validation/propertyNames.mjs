import { contextConstant, typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { pushError } from "../../error/manage.mjs";
import { errorManage } from "../../error/share.mjs";

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
                resolve: (context, { startSubSchemaExecute }) => {
                    const instanceValue = context.instanceData.current.$ref[context.instanceData.current.key];
                    const errors = [];
                    for (const instanceKey of Object.keys(instanceValue)) {
                        contextManage.enterContext(context, undefined, vocabularyActuatorConstant.pathKeys.objectKey);
                        contextManage.enterContext(context, undefined, instanceKey);
                        errors.push(...startSubSchemaExecute(context, true));
                        contextManage.backContext(context, undefined, vocabularyActuatorConstant.pathKeys.objectKey);
                        contextManage.backContext(context, undefined, instanceKey);
                    }
                    if (errors.length > 0) {
                        pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    if (Object.keys(context.instanceData.current.$ref[context.instanceData.current.key]).length > 0) {
                        startSubSchemaExecute(context, false);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
