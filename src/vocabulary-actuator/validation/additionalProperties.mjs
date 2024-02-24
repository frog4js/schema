import { typeConstant, versionConstant, vocabularyActuatorConstant } from "../../constants/share.mjs";
import { contextManage } from "../../context/share.mjs";
import { errorManage } from "../../error/share.mjs";

/**
 * @typedef {import("../../../types/share")}
 */

/**
 *
 * @type {Array<VocabularyActuatorConfig>}
 */
const configs = [
    {
        key: vocabularyActuatorConstant.keys.additionalProperties,
        versions: versionConstant.jsonSchemaVersionGroups.all,
        index: 7,
        matches: [
            {
                schemaTypes: [typeConstant.jsonTypes.boolean],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context) => {
                    if (context.schemaData.current.$ref[context.schemaData.current.key] === false) {
                        const parentSchemaInfo = contextManage.getSiblingSchemaRefData(
                            context,
                            vocabularyActuatorConstant.keys.properties,
                        );
                        const properties = parentSchemaInfo.$ref[parentSchemaInfo.key];
                        const diffProperties = Object.keys(
                            context.instanceData.current.$ref[context.instanceData.current.key],
                        ).filter((x) => !Object.keys(properties || {}).includes(x));
                        if (diffProperties.length > 0) {
                            errorManage.pushError(context);
                        }
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
            {
                schemaTypes: [typeConstant.jsonTypes.object],
                instanceTypes: [typeConstant.typeofTypes.object],
                resolve: (context, { startRefOrSchemaExecute }) => {
                    const parentSchemaInfo = contextManage.getSiblingSchemaRefData(
                        context,
                        vocabularyActuatorConstant.keys.properties,
                    );
                    const properties = parentSchemaInfo.$ref[parentSchemaInfo.key];

                    const diffProperties = Object.keys(
                        context.instanceData.current.$ref[context.instanceData.current.key],
                    ).filter((x) => !Object.keys(properties || {}).includes(x));
                    for (const diffProperty of diffProperties) {
                        contextManage.enterContext(context, undefined, diffProperty);
                        startRefOrSchemaExecute(context, false);
                        contextManage.backContext(context, undefined, diffProperty);
                    }

                    return vocabularyActuatorConstant.ticks.nextExecute;
                },
            },
        ],
    },
];
export default configs;
