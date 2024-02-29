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
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        errorManage.pushError(context, vocabularyActuatorConstant.errorMessageKeys.schemaIsFalse);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
