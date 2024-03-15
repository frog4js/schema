import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";

/**
 * @typedef import("../../types/share")
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.patternProperties,
        versions: versionConstant.jsonSchemaVersionGroups.draft03ByAdd,
        index: 31,
        matches: [
            {
                schemaTypes: [typeConstant.typeofTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    const currentSchemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    const currentInstanceData = context.instanceData.current.$ref[context.instanceData.current.key];
                    const currentSchemaKeys = Object.keys(currentSchemaData);
                    const currentInstanceKeys = Object.keys(currentInstanceData);
                    const matchKeys = new Set();
                    for (const currentSchemaKey of currentSchemaKeys) {
                        /**
                         * @type {RegExp}
                         */
                        let currentSchemaKeyReExp;
                        try {
                            currentSchemaKeyReExp = new RegExp(currentSchemaKey, "u");
                        } catch (e) {
                            continue;
                        }
                        currentInstanceKeys
                            .filter((currentInstanceKey) => {
                                return currentSchemaKeyReExp.test(currentInstanceKey);
                            })
                            .forEach((currentInstanceKey) => {
                                matchKeys.add(currentInstanceKey);
                                contextManage.enterContext(context, currentSchemaKey, currentInstanceKey);
                                startSubSchemaExecute(context, false);
                                contextManage.backContext(context, currentSchemaKey, currentInstanceKey);
                            });
                    }
                    contextManage.setCache(
                        context,
                        vocabularyActuatorConstant.keys.patternProperties,
                        Array.from(matchKeys.values()),
                        1,
                    );

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
