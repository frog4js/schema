import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.then,
        versions: versionConstant.jsonSchemaVersionGroups.draft07ByAdd,
        index: 71,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                resolve: (context) => {
                    if (
                        context.schemaData.current.$ref[context.schemaData.current.key] === false &&
                        contextManage.getCache(context, vocabularyActuatorConstant.keys.if, 1) === true
                    ) {
                        errorManage.pushError(context);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    if (contextManage.getCache(context, vocabularyActuatorConstant.keys.if, 1) === true) {
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
