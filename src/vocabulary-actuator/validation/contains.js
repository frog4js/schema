import { contextConstant, typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { pushError } from "../../error/manage.js";
import { errorManage } from "../../error/share.js";
import { typeUtil } from "../../util/share.js";

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
                resolve: (context, { startSubSchemaExecute }) => {
                    const instanceValue = context.instanceData.current.$ref[context.instanceData.current.key];
                    let status = false;
                    for (let index = 0; index < instanceValue.length; index++) {
                        contextManage.enterContext(context, undefined, index);
                        const errors = startSubSchemaExecute(context, true);
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
                instanceTypes: [typeConstant.typeofTypes.array],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === true) {
                        if (context.instanceData.current.$ref[context.instanceData.current.key].length === 0) {
                            pushError(context);
                        }
                    } else if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        errorManage.pushError(context, vocabularyActuatorConstant.errorMessageKeys.schemaIsFalse);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
