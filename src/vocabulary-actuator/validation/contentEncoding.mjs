import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
import { pushError } from "../../error/manage.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.contentEncoding,
        versions: versionConstant.jsonSchemaVersionGroups.draft07ByAdd,
        index: 73,
        matches: [
            {
                schemaTypes: [typeConstant.typeofTypes.string],
                instanceTypes: [typeConstant.jsonTypes.string],
                resolve: (context) => {
                    if (
                        context.schemaData.current.$ref[context.schemaData.current.key] ===
                        vocabularyActuatorConstant.contentEncodings.base64
                    ) {
                        try {
                            context.instanceData.current.$ref[context.instanceData.current.key] = atob(
                                context.instanceData.current.$ref[context.instanceData.current.key],
                            );
                            if (context.instancePaths.length === 0) {
                                context.instanceData.origin =
                                    context.instanceData.current.$ref[context.instanceData.current.key];
                            }
                        } catch (e) {
                            pushError(context);
                        }
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
