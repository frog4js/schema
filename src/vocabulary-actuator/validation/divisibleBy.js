import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.divisibleBy,
        versions: [versionConstant.jsonSchemaVersions.draft02, versionConstant.jsonSchemaVersions.draft03],
        index: 20,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] !== 0) {
                        const val =
                            context.instanceData.current.$ref[context.instanceData.current.key] %
                            context.schemaData.current.$ref[context.schemaData.current.key];
                        if (val !== 0) {
                            errorManage.pushError(context);
                        }
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
