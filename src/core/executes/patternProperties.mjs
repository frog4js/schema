import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.patternProperties,
        versions: versionConstant.jsonSchemaVersionGroups.draft03ByAdd,
        index: 31,
        matches: [
            {
                schemaTypes: [typeConstant.typeofTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startChildExecute }) => {
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
                                startChildExecute(context, currentSchemaKey, currentInstanceKey);
                            });
                    }
                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
