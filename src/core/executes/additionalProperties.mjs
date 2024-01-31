import { typeConstant, versionConstant, executeConstant } from "../../constants/share.mjs";
import { pushError, getSiblingSchemaRefData } from "../helper.mjs";

/**
 * @typedef {import("../../../types/core")}
 */

/**
 *
 * @type {Array<ExecuteConfig>}
 */
const configs = [
    {
        key: executeConstant.keys.additionalProperties,
        version: versionConstant.jsonSchemaVersion.all,
        index: 7,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        const parentSchemaInfo = getSiblingSchemaRefData(context, executeConstant.keys.properties);
                        const properties = parentSchemaInfo.$ref[parentSchemaInfo.key];
                        const diffProperties = Object.keys(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        ).filter((x) => !Object.keys(properties || {}).includes(x));
                        if (diffProperties.length > 0) {
                            pushError(context, "additionalPropertiesMustNotHaveAdditionalProperties");
                        }
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startChildExecute }) => {
                    const parentSchemaInfo = getSiblingSchemaRefData(context, executeConstant.keys.properties);
                    const properties = parentSchemaInfo.$ref[parentSchemaInfo.key];

                    const diffProperties = Object.keys(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    ).filter((x) => !Object.keys(properties || {}).includes(x));
                    for (const diffProperty of diffProperties) {
                        startChildExecute(context, undefined, diffProperty);
                    }

                    return executeConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
