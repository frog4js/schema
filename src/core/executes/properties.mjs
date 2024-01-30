import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.properties,
        version: versionConstant.jsonSchemaVersion.all,
        index: 5,
        matches: [
            {
                schemaTypes: [typeConstant.typeofTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startChildExecute }) => {
                    const instanceData = context.schemaData.current.$ref[context.schemaData.current.key];
                    const currentSchemaKeys = Object.keys(instanceData || {});
                    for (const propertyKey of currentSchemaKeys) {
                        startChildExecute(context, propertyKey, propertyKey);
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
