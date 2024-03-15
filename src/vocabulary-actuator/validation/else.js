import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.else,
        versions: versionConstant.jsonSchemaVersionGroups.draft07ByAdd,
        index: 72,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                resolve: (context) => {
                    if (
                        context.schemaData.current.$ref[context.schemaData.current.key] === false &&
                        contextManage.getCache(context, vocabularyActuatorConstant.keys.if, 1) === false
                    ) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    if (contextManage.getCache(context, vocabularyActuatorConstant.keys.if, 1) === false) {
                        const result = startSubSchemaExecute(context, false);
                        if (result === true) {
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
