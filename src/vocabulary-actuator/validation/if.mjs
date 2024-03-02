import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.if,
        versions: versionConstant.jsonSchemaVersionGroups.draft07ByAdd,
        index: 70,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                resolve: (context) => {
                    contextManage.setCache(
                        context,
                        vocabularyActuatorConstant.keys.if,
                        context.schemaData.current.$ref[context.schemaData.current.key],
                    );
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },

            {
                schemaTypes: [typeConstant.jsonTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    const errors = startSubSchemaExecute(context, true);
                    contextManage.setCache(context, vocabularyActuatorConstant.keys.if, errors.length === 0);
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
