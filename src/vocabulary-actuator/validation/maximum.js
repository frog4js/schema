import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";
/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.maximum,
        versions: [
            versionConstant.jsonSchemaVersions.draft01,
            versionConstant.jsonSchemaVersions.draft02,
            versionConstant.jsonSchemaVersions.draft03,
            versionConstant.jsonSchemaVersions.draft04,
            versionConstant.jsonSchemaVersions.draft05,
        ],
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
                            errorManage.pushError(context);
                        }
                    } else {
                        if (
                            context.instanceData.current.$ref[context.instanceData.current.key] >
                            context.schemaData.current.$ref[context.schemaData.current.key]
                        ) {
                            errorManage.pushError(context);
                        }
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
    {
        key: vocabularyActuatorConstant.keys.maximum,
        versions: versionConstant.jsonSchemaVersionGroups.draft06ByAdd,
        index: 9.1,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.number],
                instanceTypes: [typeConstant.typeofTypes.number],
                resolve: (context) => {
                    if (
                        context.instanceData.current.$ref[context.instanceData.current.key] >
                        context.schemaData.current.$ref[context.schemaData.current.key]
                    ) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
