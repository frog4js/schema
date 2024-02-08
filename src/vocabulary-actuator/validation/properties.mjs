import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.properties,
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
                        startRefOrSchemaExecute(context, true);
                        contextManage.backContext(context, propertyKey, propertyKey);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
