import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.required,
        versions: [versionConstant.jsonSchemaVersions.draft03],
        index: 2.1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.undefined],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === true) {
                        errorManage.pushError(context, "requiredMustBeExists");
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.required,
        versions: versionConstant.jsonSchemaVersionGroups.draft04ByAdd,
        index: 40,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.array],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context) => {
                    const instanceKeys = new Set(
                        Object.keys(context.instanceData.current.$ref[context.instanceData.current.key]),
                    );
                    const requiredKeys = context.schemaData.current.$ref[context.schemaData.current.key];

                    const result = requiredKeys.every((key) => instanceKeys.has(key));
                    if (!result) {
                        errorManage.pushError(context, "requiredMustBeExists");
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
