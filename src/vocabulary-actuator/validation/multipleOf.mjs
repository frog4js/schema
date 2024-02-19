import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.multipleOf,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 46,
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
                            errorManage.pushError(context, "multipleOfMustBeDivisible");
                        }
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
