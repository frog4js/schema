import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";

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
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const currentSchemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    const currentInstanceData = context.instanceData.current.$ref[context.instanceData.current.key];
                    const currentSchemaKeys = Object.keys(currentSchemaData);
                    const currentInstanceKeys = Object.keys(currentInstanceData);
                    for (const currentSchemaKey of currentSchemaKeys) {
                        /**
                         * @type {RegExp}
                         */
                        let currentSchemaKeyReExp;
                        try {
                            currentSchemaKeyReExp = new RegExp(currentSchemaKey);
                        } catch (e) {
                            continue;
                        }
                        currentInstanceKeys
                            .filter((currentInstanceKey) => {
                                return currentSchemaKeyReExp.test(currentInstanceKey);
                            })
                            .forEach((currentInstanceKey) => {
                                contextManage.enterContext(context, currentSchemaKey, currentInstanceKey);
                                startRefOrSchemaExecute(context, false);
                                contextManage.backContext(context, currentSchemaKey, currentInstanceKey);
                            });
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
