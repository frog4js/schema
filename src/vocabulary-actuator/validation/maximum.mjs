import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.maximum,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 9,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (contextManage.canEqualInstance(context) === false) {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] >=
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            errorManage.pushError(context, "maximumMustBeLessThanLimit");
                        }
                    } else {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] >
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            errorManage.pushError(context, "maximumMustBeLessThanOrEqualToLimit");
                        }
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
