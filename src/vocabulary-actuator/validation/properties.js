import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.js";
import { contextManage } from "../../context/share.js";
import { errorManage } from "../../error/share.js";

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
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startSubSchemaExecute }) => {
                    const currentSchemaData = context.schemaData.current.$ref[context.schemaData.current.key];
                    const currentSchemaKeys = Object.keys(currentSchemaData);
                    for (const propertyKey of currentSchemaKeys) {
                        contextManage.enterContext(context, propertyKey, propertyKey);
                        startSubSchemaExecute(context, false);
                        contextManage.backContext(context, propertyKey, propertyKey);
                    }
                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
