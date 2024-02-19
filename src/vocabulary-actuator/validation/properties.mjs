import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 * @typedef import("../../types/share")
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.properties,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 5,
        matches: [
            {
                schemaTypes: [typeConstant.typeofTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const currentSchemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    const currentSchemaKeys = Object.keys(currentSchemaData);
                    for (const propertyKey of currentSchemaKeys) {
                        contextManage.enterContext(context, propertyKey, propertyKey);
                        startRefOrSchemaExecute(context, false);
                        contextManage.backContext(context, propertyKey, propertyKey);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
